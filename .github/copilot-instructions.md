# Instruções para GitHub Copilot Code Review

Este arquivo é lido pelo GitHub Copilot quando ele revisa um PR neste repo.
Define o contexto, a metodologia, e os critérios que o Copilot deve aplicar.

---

## Sobre o repo

`cloud-native-course` é material de treinamento técnico em conceitos
cloud-native e práticas de produção. Aplicação real (mini-ledger
transacional) implementada em **Go e Node em paralelo**, evoluindo
commit a commit do nível ingênuo até production-ready.

Documentos de referência:

- `README.md` — visão geral
- `SYLLABUS.md` — 13 módulos detalhados
- `METHODOLOGY.md` — TDD, git flow, níveis jr/mid/sr
- `ROADMAP.md` — ordem dos módulos + gates de fechamento

---

## O que o Copilot deve validar em CADA PR

### 1. Conventional Commits

Cada commit segue o formato `<type>(<scope>): <subject>`.

Types permitidos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`,
`perf`, `style`.

Subject em imperativo, < 72 caracteres.

Body com **decisão + porquê + armadilha evitada** quando o commit
altera comportamento ou faz escolha arquitetural (commits de `feat` e
`refactor`).

### 2. Sequência TDD Chicago

Para cada feature implementada deve haver sequência:

```
test(red): <feature> — describe expected behavior
feat(green): <feature> — minimal passing implementation
refactor: <feature> — extract X, simplify Y  (opcional)
```

**Flag**: feature implementada (`feat:`) sem teste correspondente
vermelho antes. Isso é violação central da metodologia.

### 3. Níveis declarados (jr/mid/sr)

Commits de feature devem indicar nível no scope ou body:

- `feat(jr): ...` — implementação ingênua, foco em conceito
- `feat(mid): ...` — idiomático, error handling, structured logs
- `feat(sr): ...` — production-ready, observabilidade, idempotency

Pular níveis (ex: ir direto pra sr sem fazer jr antes) tira o
trade-off visível do roteiro — flagar.

### 4. Arquitetura hexagonal

- Domínio (`internal/<domain>/` em Go, `src/domain/` em Node)
  define interfaces (ex: `Repository`, `Publisher`).
- Adapters (`internal/storage/`, `internal/broker/`, `internal/http/`)
  implementam as interfaces.
- Domínio **não importa** nada de infra/adapter.

**Flag**: domínio importando struct concreta de adapter, ou
interface definida no adapter (deveria estar no domínio).

### 5. Testes com dependências reais (Testcontainers)

Testes de integração devem usar **Testcontainers** (Postgres real,
RabbitMQ real). Mock só em último caso, com justificativa em
comentário do teste.

**Flag**: mock injustificado em teste de integração. Especialmente
mock de DB ou broker quando Testcontainers cabe.

### 6. Sem ORM em Go

Imports proibidos: `gorm.io/*`, `github.com/uptrace/bun`,
`github.com/go-pg/pg`, `entgo.io/ent`.

Uso direto de **pgx + SQL** é o padrão.

### 7. Anti-patterns clássicos de Go a flagar

- `log.Fatalf` em código de produção (mata defers, vaza recursos)
- `var forever chan struct{}` ou outro pattern de tutorial
- `auto-ack: true` em consumers RabbitMQ
- Função que faz I/O sem `context.Context` no 1º parâmetro
- Erro engolido (`_, _ = thing.Do()`)
- Slice/map passado por valor esperando mutação visível ao caller
- Goroutine disparada sem caminho claro de término (potencial leak)
- `append` sem reassign quando vai sair da função

### 8. Anti-patterns clássicos de Node a flagar

- `Promise` sem `await` ou `.catch` (unhandled rejection)
- Erro engolido em try/catch sem rethrow ou log estruturado
- `console.log` em código que devia usar logger estruturado (`pino`)
- `process.exit(1)` no meio de código, sem defers/cleanup
- Falta de `cause` em erro relançado (Node 16+)
- Função async sem timeout em chamadas externas

### 9. Observabilidade

A partir do módulo 5 (Observability), TODA feature nova deve nascer
instrumentada:

- Logs estruturados (slog em Go, pino em Node) com campos relevantes
- Métricas RED ou USE expostas (Prometheus)
- Traces propagados via OpenTelemetry (context propagation)
- `trace_id` correlacionando logs e traces

**Flag**: feature adicionada sem instrumentação quando o módulo já
exige (≥ módulo 5).

### 10. Idempotência (módulos 6+)

Endpoints de mutação (`POST /transactions`, `POST /transfers`) devem
aceitar `Idempotency-Key` header e garantir resposta consistente em
retries.

DB inserts em rotas idempotentes usam `ON CONFLICT (id) DO NOTHING`
ou pattern equivalente.

**Flag**: rota de mutação sem suporte a idempotency-key a partir
do módulo 6.

### 11. Mensagens de commit fracas

Commits `feat:` / `refactor:` com mensagem genérica ("wip", "fixes",
"updates", "small refactor") são bandeira vermelha. Esperado:
mensagem-aula com decisão arquitetural e trade-off.

### 12. README do módulo

PRs de fechamento de módulo (`module/* → main`) devem ter o
`modules/NN-*/README.md` preenchido com palavras próprias do aluno,
não copy do SYLLABUS.

`COMPARISON.md` do módulo deve ter pelo menos 3 trade-offs reais
Go vs Node listados.

---

## Tom do feedback do Copilot

- Direto, técnico, sem floreio.
- Cita o conceito específico (ex: "isso viola hexagonal — domínio
  importando adapter direto") em vez de comentário vago.
- Quando flaga anti-pattern, explica POR QUÊ é anti-pattern + sugere
  a alternativa idiomática.
- Não duplica check programático (commitlint, lint, test) — esse
  trabalho já está no workflow `pr-checks.yml`.

---

## O que o Copilot NÃO precisa flagar

- Estilo cosmético (espaços, vírgula final) — o linter já cuida.
- Performance prematura — se o módulo não é o 10 (Performance), não
  é hora.
- Sugestões de feature além do escopo do módulo atual.
- Comentários genéricos tipo "consider adding tests" — se não tem
  teste, é falha objetiva do TDD, não sugestão.

---

## Quando dispensar review do Copilot

PRs puramente cosméticos (typos em README, ajuste de markdown) podem
ser merged sem review. PRs de feature, refactor, ou fim de módulo
sempre passam por review.
