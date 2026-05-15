# VERSIONS — Módulo 1

> **Entregável do aluno.** Este arquivo é um template. Os campos marcados
> com `<...>` são pra você preencher — pesquisando, não chutando. Preencher
> este arquivo é o **primeiro exercício do módulo**.
>
> Trabalhe na sua branch (`feature/versions` derivada de
> `module/01-foundations`). Se travar, a branch de referência do curso
> mostra uma versão preenchida — consulte só depois de tentar.

---

## Por que este arquivo existe

Versão de dependência não é detalhe de setup — é decisão de arquitetura.
A versão que você escolhe hoje define:

- Por quanto tempo você recebe **patch de segurança**.
- Se o próximo `bump` vai ser tranquilo ou um incidente.
- Se outra pessoa consegue reproduzir seu build seis meses depois.

Documentar a escolha — com fonte e justificativa — força a decisão a ser
**consciente**. "Peguei a que o tutorial usava" não é resposta aceitável
em produção.

---

## Como pesquisar uma versão (método)

Para **runtime / linguagem** (Go, Node), responda nesta ordem:

1. **Qual o status de suporte da versão?**
   `Current` → instável, não-produção.
   `Active LTS` → recebe features + fixes, **é o que produção usa**.
   `Maintenance LTS` → só security fix, saída próxima — não comece projeto aqui.
   `EOL` → sem patch nenhum, risco aberto.
2. **Até quando recebe security patch?** A data de EOL importa mais que
   o número da versão.
3. **A escolha é Active LTS?** Se não for, justifique muito bem.

Para **bibliotecas**, antes de adicionar:

1. Ler o **CHANGELOG** das últimas versões — procurar `BREAKING CHANGE`.
2. Avaliar maturidade: frequência de release, issues abertas vs fechadas,
   se há release recente corrigindo CVE.
3. Confirmar que existe **lockfile** travando a versão transitiva.

Para **infra** (DB, broker, observability):

1. Preferir `stable` > `LTS` > `latest` quando o componente é core.
2. Major bump em componente **com dados persistentes** exige plano de
   migração — não é trocar a tag da imagem.

### Fontes oficiais (use estas, não blog aleatório)

| Tipo                   | Fonte                                                 |
| ---------------------- | ----------------------------------------------------- |
| Ciclo de vida geral    | <https://endoflife.date>                              |
| Go                     | <https://go.dev/doc/devel/release>                    |
| Node.js                | <https://nodejs.org/en/about/previous-releases>       |
| pnpm                   | <https://github.com/pnpm/pnpm/releases>               |
| Bibliotecas (genérico) | página de Releases / CHANGELOG no repositório oficial |
| Imagens de container   | Docker Hub / registry oficial do projeto              |

Regra: **cruze duas fontes**. `endoflife.date` resume; a fonte oficial confirma.

---

## Exemplo de formato (como preencher uma linha)

> Linha ilustrativa — não é um componente real do projeto, é só pra
> mostrar o nível de detalhe esperado:

| Componente       | Versão  | Status       | Suporte até | Fonte          | Justificativa                                                     |
| ---------------- | ------- | ------------ | ----------- | -------------- | ----------------------------------------------------------------- |
| _ExemploRuntime_ | _4.2.x_ | _Active LTS_ | _2027-09_   | _link oficial_ | _Active LTS com a maior janela de suporte; a 5.x ainda é Current_ |

---

## Tabela de versões — PREENCHA

### Runtime / linguagem

| Componente | Versão  | Status  | Suporte até | Fonte   | Justificativa |
| ---------- | ------- | ------- | ----------- | ------- | ------------- |
| Go         | `<...>` | `<...>` | `<...>`     | `<...>` | `<...>`       |
| Node.js    | `<...>` | `<...>` | `<...>`     | `<...>` | `<...>`       |

### Gerenciador de pacotes / build

| Componente    | Versão  | Status  | Fonte   | Justificativa |
| ------------- | ------- | ------- | ------- | ------------- |
| pnpm          | `<...>` | `<...>` | `<...>` | `<...>`       |
| golangci-lint | `<...>` | `<...>` | `<...>` | `<...>`       |

### Bibliotecas — Go

| Componente                                               | Versão  | Fonte (CHANGELOG) | Justificativa |
| -------------------------------------------------------- | ------- | ----------------- | ------------- |
| caarlos0/env                                             | `<...>` | `<...>`           | `<...>`       |
| godotenv                                                 | `<...>` | `<...>`           | `<...>`       |
| _(`log/slog` é stdlib — sem versão própria, segue o Go)_ | —       | —                 | —             |

### Bibliotecas — Node

| Componente | Versão  | Fonte (CHANGELOG) | Justificativa |
| ---------- | ------- | ----------------- | ------------- |
| TypeScript | `<...>` | `<...>`           | `<...>`       |
| Fastify    | `<...>` | `<...>`           | `<...>`       |
| Pino       | `<...>` | `<...>`           | `<...>`       |
| Zod        | `<...>` | `<...>`           | `<...>`       |
| Vitest     | `<...>` | `<...>`           | `<...>`       |

### Infra (imagens de container)

| Componente              | Versão / tag | Tipo    | Fonte   | Justificativa |
| ----------------------- | ------------ | ------- | ------- | ------------- |
| PostgreSQL              | `<...>`      | `<...>` | `<...>` | `<...>`       |
| RabbitMQ                | `<...>`      | `<...>` | `<...>` | `<...>`       |
| Prometheus              | `<...>`      | `<...>` | `<...>` | `<...>`       |
| Grafana Tempo           | `<...>`      | `<...>` | `<...>` | `<...>`       |
| Grafana Loki            | `<...>`      | `<...>` | `<...>` | `<...>`       |
| Grafana                 | `<...>`      | `<...>` | `<...>` | `<...>`       |
| OpenTelemetry Collector | `<...>`      | `<...>` | `<...>` | `<...>`       |

---

## Onde travar cada versão — PREENCHA

Saber a versão não basta; ela tem que estar **travada** num arquivo que o
build respeita. Liste, pra cada componente, qual arquivo o trava:

| Componente       | Arquivo que trava | Por que ali |
| ---------------- | ----------------- | ----------- |
| Go               | `<...>`           | `<...>`     |
| Node.js          | `<...>`           | `<...>`     |
| pnpm             | `<...>`           | `<...>`     |
| Bibliotecas Go   | `<...>`           | `<...>`     |
| Bibliotecas Node | `<...>`           | `<...>`     |
| Imagens de infra | `<...>`           | `<...>`     |

---

## Política de upgrade — PREENCHA

Defina a política que **este projeto** vai seguir. Use o conceito de semver
(`MAJOR.MINOR.PATCH`) pra decidir o nível de cautela de cada tipo de bump:

- **Patch** (`x.y.Z`): `<como tratar? automático? manual?>`
- **Minor** (`x.Y.0`): `<como tratar?>`
- **Major** (`X.0.0`): `<como tratar? exige o quê?>`
- **Infra com dados persistentes**: `<que cuidado extra?>`

---

## Checklist do entregável

- [ ] Toda linha `<...>` preenchida — sem campo em branco.
- [ ] Toda versão tem **fonte oficial** linkada (não blog, não Stack Overflow).
- [ ] Toda escolha de runtime declara o **status de suporte** e justifica
      por que não é uma versão mais nova nem mais antiga.
- [ ] A política de upgrade está definida e faz sentido pro contexto.
- [ ] Você consegue explicar, em voz alta, por que escolheu cada versão.
