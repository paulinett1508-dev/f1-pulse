import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import type { IncomingMessage, ServerResponse } from 'node:http';

const OPENF1_BASE = 'https://api.openf1.org/v1';

async function openf1<T>(
  endpoint: string,
  params: Record<string, string | number> = {},
): Promise<T[]> {
  const url = new URL(`${OPENF1_BASE}${endpoint}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json() as Promise<T[]>;
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

const sessionKey = z.number().int().positive().optional().describe(
  'Session key (integer). Omit for the latest session.',
);

const driverNumber = z.number().int().positive().optional().describe(
  'Driver car number. Omit for all drivers.',
);

function createMcpServer() {
  const server = new McpServer({ name: 'f1-pulse', version: '1.0.0' });

  server.tool('get_current_session', 'Get information about the latest F1 session', {}, async () => {
    const sessions = await openf1<Record<string, unknown>>('/sessions', { session_key: 'latest' });
    return { content: [{ type: 'text', text: JSON.stringify(sessions[0] ?? null, null, 2) }] };
  });

  server.tool(
    'get_drivers',
    'Get all drivers in an F1 session with team and country info',
    { session_key: sessionKey },
    async ({ session_key }) => {
      const data = await openf1<Record<string, unknown>>('/drivers', {
        session_key: session_key ?? 'latest',
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'get_race_positions',
    'Get current or final race positions sorted by place',
    { session_key: sessionKey },
    async ({ session_key }) => {
      const positions = await openf1<{ driver_number: number; position: number; date: string }>(
        '/position',
        { session_key: session_key ?? 'latest' },
      );
      const latestByDriver = new Map<number, (typeof positions)[0]>();
      for (const p of positions) latestByDriver.set(p.driver_number, p);
      const sorted = [...latestByDriver.values()].sort((a, b) => a.position - b.position);
      return { content: [{ type: 'text', text: JSON.stringify(sorted, null, 2) }] };
    },
  );

  server.tool(
    'get_weather',
    'Get latest weather at the circuit: air/track temperature, humidity, wind, rainfall',
    { session_key: sessionKey },
    async ({ session_key }) => {
      const data = await openf1<Record<string, unknown>>('/weather', {
        session_key: session_key ?? 'latest',
      });
      return {
        content: [{ type: 'text', text: JSON.stringify(data[data.length - 1] ?? null, null, 2) }],
      };
    },
  );

  server.tool(
    'get_race_control_messages',
    'Get race control messages: safety car, VSC, flags, penalties, and incidents',
    { session_key: sessionKey },
    async ({ session_key }) => {
      const data = await openf1<Record<string, unknown>>('/race_control', {
        session_key: session_key ?? 'latest',
      });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'get_tire_stints',
    'Get tire compound and stint strategy for drivers',
    { session_key: sessionKey, driver_number: driverNumber },
    async ({ session_key, driver_number }) => {
      const params: Record<string, string | number> = { session_key: session_key ?? 'latest' };
      if (driver_number !== undefined) params.driver_number = driver_number;
      const data = await openf1<Record<string, unknown>>('/stints', params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    'get_lap_times',
    'Get lap times for a session, optionally filtered by driver',
    { session_key: sessionKey, driver_number: driverNumber },
    async ({ session_key, driver_number }) => {
      const params: Record<string, string | number> = { session_key: session_key ?? 'latest' };
      if (driver_number !== undefined) params.driver_number = driver_number;
      const data = await openf1<Record<string, unknown>>('/laps', params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    },
  );

  return server;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const body = await readBody(req);
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, body);
  await server.close();
}
