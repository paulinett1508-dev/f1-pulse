---
description: Lembrete após salvar ou criar arquivos no projeto
---

Sempre que você criar ou salvar arquivos no projeto, lembre o usuário de executar o script de sincronização para copiar os arquivos do host para o container:

```bash
bash /root/antigravity/sync.sh
```

Este script copia todos os arquivos de `/root/antigravity` no host para o diretório `/app` dentro do container Docker `f1-pulse`.

> **Nota:** Execute este script após cada sessão de edição para manter o container atualizado.
