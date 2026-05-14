# SYLLABUS — Cloud-Native Engineering (Go vs Node)

> Detalhe dos 13 módulos. Cada módulo é uma camada de profundidade
> dos conceitos cloud-native e das práticas que sustentam sistema em produção.
> O aluno **digita 100% do código**, segue **TDD Chicago-style**, e
> **só avança quando absorve** (responde as 7 perguntas de calibração + dá a aula sem notas).

---

## App fio condutor: Mini-Ledger Transacional

Domínio escolhido por exercitar idempotência, concorrência com estado mutável,
CQRS lite, saga e segurança — todos os patterns que aparecem em sistema real
de produção quando o domínio é dinheiro, ordem, ou qualquer coisa que precisa
ser exatamente uma vez.

### API

```
POST /accounts                  — cria conta
POST /transactions              — submete lançamento (header Idempotency-Key)
POST /transfers                 — transferência entre 2 contas (saga choreography)
GET  /accounts/{id}/balance     — saldo materializado
GET  /accounts/{id}/transactions — extrato paginado por cursor
```

### Stack base

| Camada  | Go                                        | Node                              |
| ------- | ----------------------------------------- | --------------------------------- |
| HTTP    | stdlib `net/http` (1.22+ method matching) | Fastify + TypeScript              |
| DB      | pgx/v5 + pgxpool                          | pg + Kysely (typed query builder) |
| Broker  | amqp091-go                                | amqplib                           |
| Logs    | slog (JSON)                               | pino                              |
| Metrics | prometheus/client_golang                  | prom-client                       |
| Traces  | OpenTelemetry SDK Go                      | OpenTelemetry SDK Node            |
| Testes  | testing + testify + testcontainers-go     | Vitest + testcontainers-node      |
| Config  | caarlos0/env/v11                          | zod + dotenv                      |

### Infra compartilhada (`app/infra/compose.yaml`)

Postgres 18 · RabbitMQ 4.3 · OpenTelemetry Collector 0.152 · Prometheus 3.5 LTS ·
Grafana 13 · Tempo 2.9 (traces) · Loki 3.7 (logs).

---

## Estrutura padrão de cada módulo

```
modules/NN-slug/
├── README.md           # objetivos, conceitos, pré-requisitos, exercícios, referências
├── COMPARISON.md       # síntese trade-offs Go vs Node deste módulo
├── go/                 # implementação Go (3 níveis: jr, mid, sr)
├── node/               # implementação Node (3 níveis: jr, mid, sr)
└── assessment.md       # 7 perguntas pra fechar o módulo
```

---

## Os 13 módulos

### Módulo 1 — Foundations & Project Setup

**Objetivo**: estabelecer estrutura, ferramentas e padrões que vão sustentar
todos os módulos seguintes.

**Conceitos cobertos**:

- Arquitetura hexagonal aplicada (não dogmática)
- Dependency Injection manual — sem framework
- `cmd/internal` (Go) vs `src/domain/infrastructure` (Node)
- Config tipada com fail-fast (caarlos0/env vs zod)
- Signal handling: `signal.NotifyContext` (Go) e `process.on('SIGTERM')` (Node)
- Graceful shutdown de HTTP server e workers
- Logger estruturado (slog vs pino)
- Conventional Commits enforcement

**Lab**: subir a stack de infra + criar 2 aplicações "hello" que cumprimentam,
expõem `/healthz`, leem config tipada, e fazem shutdown limpo em SIGTERM.

**Referências**:

- _The Twelve-Factor App_ (12factor.net)
- Code: Kubernetes `cmd/` structure (qualquer repo CNCF)
- Talk: "Practical Go: Real World Advice For Writing Maintainable Programs" — Dave Cheney

**Critério de fechamento**:

- App sobe, responde, faz shutdown limpo em ambas linguagens.
- Config faltando = falha no boot, não em runtime.

---

### Módulo 2 — Testing Pyramid & TDD Chicago

**Objetivo**: dominar TDD com dependências reais. Sair do hábito de mockar tudo.

**Conceitos cobertos**:

- Pirâmide unit / integration / e2e — proporção saudável
- TDD Chicago-style: red → green → refactor com dependências reais
- Table-driven tests em Go
- Vitest + describe/it patterns em Node
- Testcontainers Postgres + RabbitMQ em ambos
- `t.Helper()`, `t.Cleanup()`, `t.Parallel()` em Go
- Setup/teardown idiomático sem `beforeEach` aninhado
- Coverage com sentido (não chasing 100%)

**Lab**: implementar `POST /accounts` em ambas linguagens **100% via TDD**.
Cada step do red-green-refactor é 1 commit. Sem implementação sem teste falhando antes.

**Referências**:

- _Growing Object-Oriented Software, Guided by Tests_ (Freeman & Pryce)
- "Test Pyramid" — Martin Fowler post canônico
- testcontainers-go docs
- Talk: "TDD: Where Did It All Go Wrong?" — Ian Cooper

**Critério de fechamento**: aluno escreve teste antes de código pelo resto do curso. **Sem desvio.**

---

### Módulo 3 — Concurrency & Parallelism

**Objetivo**: entender de verdade o modelo de concorrência de cada linguagem,
no nível dos primitivos do runtime, sem analogia frouxa.

**Conceitos cobertos**:

- **Go**: modelo G/M/P do runtime, goroutines (~2KB stack), preemption (1.14+),
  `GOMAXPROCS`, `runtime.NumCPU()`, work stealing
- **Node**: event loop + libuv thread pool, microtasks vs macrotasks, worker_threads
- Diferença concorrência vs paralelismo (Rob Pike)
- `sync.Mutex` vs `sync.RWMutex` vs `sync.Map` vs `atomic.Value` — quando usar cada
- `sync.WaitGroup`, `errgroup.Group`
- Channels: buffered vs unbuffered, fanout/fanin, pipeline pattern
- Goroutine leak: identificação + correção
- Race detector (`-race`)
- Cancellation cooperativo via `context`
- Em Node: `Promise.all` vs `Promise.allSettled`, controle de concorrência com `p-limit`

**Lab**: implementar saldo agregado com **race condition deliberada** em ambos.
Reproduzir o bug. Corrigir com lock apropriado. Comparar performance:
Go N cores vs Node single thread (CPU-bound + IO-bound mistos).

**Referências**:

- _Concurrency in Go_ (Katherine Cox-Buday) — caps 2, 3, 4
- "Concurrency is not parallelism" — Rob Pike (talk + transcript)
- "Don't communicate by sharing memory; share memory by communicating" — Go proverbs
- Node.js docs: "The Node.js Event Loop, Timers, and process.nextTick()"

**Critério de fechamento**: aluno responde "esse goroutine vaza?" em 60 segundos
com justificativa correta.

---

### Módulo 4 — Error Handling & Resilience

**Objetivo**: erro não é exceção — é caminho normal do código.

**Conceitos cobertos**:

- **Go**: sentinel errors (`var ErrFoo = errors.New(...)`), `errors.Is`, `errors.As`,
  error wrapping com `%w`, custom error types, panic vs error
- **Node**: classes de erro customizadas, `cause` (Node 16+),
  AsyncLocalStorage para correlation, `unhandledRejection` e `uncaughtException`
- Retry exponencial com **jitter** (cenarios full vs decorrelated jitter)
- Circuit breaker (sony/gobreaker, opossum) — closed/open/half-open
- Timeout management em camadas (ctx, http.Server, broker, DB)
- Bulkhead pattern (isolar pools)
- Fail-fast vs fail-safe — quando aplicar cada
- Idempotency token na borda

**Lab**: simular RabbitMQ caindo intermitentemente. Cliente deve ver retry → breaker
abrir → traffic shed → broker volta → breaker fecha. Tudo observável via métricas.

**Referências**:

- Paper: "Exponential Backoff And Jitter" — AWS Architecture Blog
- _Release It!_ (Michael Nygard) — caps 5-6
- sony/gobreaker source code (leitura)
- "Errors Are Values" — Rob Pike

**Critério de fechamento**: aluno desenha em quadro branco o estado de um circuit
breaker em 3 minutos, sem consultar.

---

### Módulo 5 — Observability

**Objetivo**: virar "logs no console" em ferramenta de diagnóstico real.

**Conceitos cobertos**:

- **3 pilares**: logs, métricas, traces — e como se conectam via trace_id
- Structured logging: campos no JSON (slog vs pino)
- **OpenTelemetry SDK** propagando trace context end-to-end
  (HTTP → broker → DB) em ambas linguagens
- Prometheus client libs: **RED** (rate, errors, duration) + **USE** (utilization,
  saturation, errors) — quando aplicar cada
- Histograms vs summaries — bucket sizing
- Cardinality controlada — label que NÃO virar (user_id, request_id)
- SLI / SLO / SLA / error budget
- Logs com `traceID` injetado para fechar o loop
- Grafana dashboards básicos (não JSON manual — via UI mesmo)

**Lab**: instrumentar transação completa. Mandar request, ver no Tempo o trace
HTTP→handler→broker publish→consumer→DB. Achar trace_id no Loki. Alerta Prom
quando P99 sobe acima de 200ms.

**Referências**:

- _Observability Engineering_ (Majors, Fong-Jones, Miranda)
- OpenTelemetry docs: Semantic Conventions
- Brendan Gregg: "The USE Method" + "RED Method"
- Talk: "OpenTelemetry From the Trenches" — qualquer KubeCon

**Critério de fechamento**: "P99 subiu 10x — o que tu olha primeiro?" — aluno
descreve fluxo correto (USE/RED do serviço, depois trace de outlier, depois log).

---

### Módulo 6 — Persistence Patterns

**Objetivo**: persistência confiável sob falha. Sem ORM.

**Conceitos cobertos**:

- **Idempotência forte** via `idempotency_key` UNIQUE + `ON CONFLICT DO NOTHING`
- Transactions + isolation levels: READ COMMITTED vs REPEATABLE READ vs SERIALIZABLE
- Optimistic locking via `version` column (CAS)
- Pessimistic locking: `SELECT ... FOR UPDATE`
- **Outbox pattern**: atomicidade entre DB write + broker publish
- Migrations versionadas (golang-migrate, node-pg-migrate)
- Schema versioning + backward compatibility
- Conexão pool tuning (MaxConns, ConnMaxLifetime)
- Read replicas (intro — fundo no módulo 12)

**Lab**: implementar `POST /transactions` com idempotency key + outbox. Teste com
Testcontainers que **mata o processo** entre INSERT do lançamento e publish no
broker. Reinício deve recuperar (outbox publisher dispatcher).

**Referências**:

- _Designing Data-Intensive Applications_ (Kleppmann) — cap 7
- "Pattern: Transactional Outbox" — microservices.io
- Postgres docs: Concurrency Control
- pgx wiki + examples

**Critério de fechamento**: aluno explica outbox vs 2PC + por que outbox é
escolha pragmática moderna.

---

### Módulo 7 — Messaging & Event-Driven

**Objetivo**: mensageria de produção. Não Hello World.

**Conceitos cobertos**:

- At-least-once vs at-most-once vs **exactly-once efetivo**
  (= at-least-once + idempotência)
- Manual ack vs auto-ack (auto-ack é bug com cara de feature)
- Persistent delivery + durable queue
- **Dead Letter Queue** (`x-dead-letter-exchange`)
- Poison pill handling (TTL, max retries, DLQ routing)
- Saga **orchestration** vs **choreography** — quando aplicar cada
- Event versioning + backward/forward compatibility
- Schema registry conceitual (Avro/Protobuf — leitura, não implementação aqui)
- Outbox → broker bridge

**Lab**: implementar `POST /transfers` como saga **choreography**:
event `TransferInitiated` → consumer A debita conta origem → emite
`AccountDebited` → consumer B credita conta destino → emite `TransferCompleted`.
Cenário de falha: B falha → C compensa A.

**Referências**:

- _Enterprise Integration Patterns_ (Hohpe & Woolf) — patterns clássicos
- RabbitMQ docs: "Reliability Guide"
- "Pattern: Saga" — microservices.io
- "You Cannot Have Exactly-Once Delivery" — Bravenec post

**Critério de fechamento**: aluno modela uma saga de 4 passos em quadro branco
com pontos de compensação corretos.

---

### Módulo 8 — HTTP & API Design

**Objetivo**: API que recruiter sênior olha e respeita.

**Conceitos cobertos**:

- Status codes semânticos completos (200, 201, 202, 204, 301, 304, 400, 401,
  403, 404, 409, 422, 429, 500, 502, 503, 504)
- **Idempotency-Key header** (estilo Stripe) — implementação completa
- Pagination: cursor-based (correto) vs offset-based (problemático em escala)
- HATEOAS lite — links em respostas, sem dogmatismo
- OpenAPI spec gerada (swag em Go, fastify-swagger em Node)
- API versioning: URL path vs header vs media type
- Rate limiting: token bucket (golang.org/x/time/rate, @fastify/rate-limit)
- CORS sério (não `Access-Control-Allow-Origin: *`)
- Compression negotiation
- ETag + If-None-Match

**Lab**: documentar API com OpenAPI gerada do código. Implementar idempotency
real (request hash + response cache). Implementar rate limit por API key + por IP.

**Referências**:

- Stripe API docs (referência de API bem desenhada)
- "REST API Design Rulebook" — Mark Massé
- RFC 9457 (Problem Details for HTTP APIs)

**Critério de fechamento**: aluno explica em 60s por que `POST /transfers` com
mesma idempotency-key retorna sempre a mesma resposta.

---

### Módulo 9 — Security

**Objetivo**: OWASP Top 10 aplicado, não citado.

**Conceitos cobertos**:

- Input validation forte (go-playground/validator, zod)
- SQL injection (mesmo com prepared statements — onde escapa?)
- Authentication: JWT vs session — quando cada
- Authorization: RBAC + ABAC light
- Secrets management: env vs vault, rotation
- TLS in-cluster (mTLS conceitual)
- Request signing com HMAC (estilo AWS SigV4 simplificado)
- Timing attacks + `subtle.ConstantTimeCompare` (Go) / `timingSafeEqual` (Node)
- CSRF + SameSite cookies
- Dependency scanning (gosec, npm audit, dependabot)

**Lab**: assinar `POST /transactions` com HMAC. Implementar verificação em
constant time. Demonstrar timing attack na implementação ingênua e correção.
Adicionar gosec + npm audit no CI.

**Referências**:

- OWASP Top 10 (2021)
- "Crypto 101" — Laurens Van Houtven (free book)
- Go security blog posts oficiais
- Node security best practices oficiais

**Critério de fechamento**: aluno encontra 3 vulnerabilidades plantadas pelo
instrutor no código de outro aluno (peer review).

---

### Módulo 10 — Performance & Profiling

**Objetivo**: medir antes de otimizar. Sempre.

**Conceitos cobertos**:

- **Go pprof**: CPU, heap, goroutine, block, mutex profiles
- `runtime/trace` (execution tracer)
- Benchmarking com `testing.B`, `benchstat`
- **Node profiling**: `--prof`, clinic.js (doctor, flame, bubble), 0x
- Memory: heap snapshots, identifying allocations no hot path
- Lock contention identification
- Hot path identification + reduction de allocations
- `sync.Pool` (Go) para reuso
- **k6** para load testing — RED metrics durante load
- "Optimize for P99, not mean"

**Lab**: medir baseline do app, achar bottleneck via profiler (instrutor planta
um — alocação desnecessária em hot path), corrigir, medir delta. Em ambas
linguagens.

**Referências**:

- "High Performance Go Workshop" — Dave Cheney slides
- Brendan Gregg: flame graphs (qualquer post)
- clinic.js docs

**Critério de fechamento**: aluno apresenta um flame graph e identifica o
bottleneck dominante em 90 segundos.

---

### Módulo 11 — Cloud-Native Deployment

**Objetivo**: do container ao cluster, sem mágica.

**Conceitos cobertos**:

- Multi-stage Dockerfile + **distroless** (Go) + `node:slim` ou distroless-base (Node)
- BuildKit cache mounts, `ARG TARGET`
- Image scanning (Trivy)
- Semver + git tags + CHANGELOG.md
- CI/CD com GitHub Actions: build → test → scan → push
- Helm chart básico (não dogmático — só o que serve)
- **k3d** (k3s em Docker) — cluster local realista
- **Readiness vs Liveness probe** — diferença crucial
- Rolling update + maxSurge / maxUnavailable
- Blue/Green vs Canary — quando aplicar
- ArgoCD GitOps básico

**Lab**: deploy do app no k3d local. Fazer rolling update **com graceful shutdown
correto** (mostrar request sem 500 durante deploy). Forçar rollback automatizado.

**Referências**:

- Kubernetes docs: Pod Lifecycle, Probes
- "Best practices for writing Dockerfiles" — Docker docs
- ArgoCD docs: Getting Started
- "Kubernetes Patterns" (Ibryam & Huss)

**Critério de fechamento**: aluno explica por que readiness probe ruim quebra
rolling update — com exemplo.

---

### Módulo 12 — Distributed Systems Fundamentals

**Objetivo**: fluência conceitual em sistema distribuído. Sair do "eventually
consistent é bom" sem saber o que isso significa.

**Conceitos cobertos**:

- **CAP theorem real** — não slogan. Trade-off em partition.
- ACID vs BASE
- Consistência: strong, eventual, causal, monotonic read, monotonic write
- Replication patterns:
  - Leader-follower (Postgres standby)
  - Multi-leader (perigos)
  - Leaderless (Dynamo-style)
- Consensus básico: Raft conceitual (alta abstração — não implementar)
- Partial failure — falha que NÃO derruba sistema todo
- Clock skew + logical clocks (Lamport, vector clocks) — quando precisa
- Quorum reads/writes (R + W > N)
- Read-your-writes consistency

**Lab**: Postgres com 1 primary + 1 standby via Docker Compose. Simular network
partition (`iptables`, `tc`) entre os 2. Observar split-brain. Discutir o que
faria diferente com Spanner/CockroachDB.

**Referências canônicas**:

- _Designing Data-Intensive Applications_ (Kleppmann) — caps 5, 7, 8, 9
- Paper: Dynamo (2007) — leitura completa
- Paper: Spanner (2012) — overview
- "Jepsen analyses" — Aphyr (qualquer 2-3)
- Raft paper (não precisa implementar — entender)

**Critério de fechamento**: aluno desenha em quadro o trade-off CAP de 3
sistemas diferentes (Postgres standby, Cassandra, DynamoDB) em 5 minutos.

---

### Módulo 13 — Capstone & Integração final

**Objetivo**: consolidar, validar, integrar todos os módulos num único exercício
que prova absorção real.

**Entregáveis**:

1. **Incident postmortem** gravado do app. Instrutor injeta 1 falha real
   (ex: liveness probe matando pod sob load, conexão pool esgotando, race
   no saldo). Aluno investiga, identifica, documenta em formato SRE
   (timeline, root cause, contributing factors, action items).
2. **System design review** do próprio sistema. Perguntas: "Escala pra 10x
   tráfego — o que muda? E 100x?" Aluno desenha o novo diagrama + ADRs das
   decisões.
3. **ADRs retrospectivas** das decisões dos 12 módulos (Architecture Decision Records).
4. **Apresentação final gravada** — aluno responde:
   - 7 perguntas de calibração (abaixo)
   - 5 perguntas profundas sobre o sistema (escolhidas pela equipe)
   - Em < 90s cada, sem consultar notas
5. **Self-scorecard** por módulo: o que dominou, gaps, plano de fechamento.

**Critério de fechamento**: aluno auto-avalia em CADA módulo "passou" ou "ainda
tem gap" honestamente. Plano explícito pros gaps.

---

## Critério de qualidade

As 7 perguntas de calibração que **precisam ser respondidas em < 90s com
nome técnico correto, exemplo concreto, trade-off explícito**:

|   # | Tópico         | Pergunta                                                             |
| --: | -------------- | -------------------------------------------------------------------- |
|   1 | Slice/append   | "O que imprime esse código?" (slice + modify + append)               |
|   2 | Concurrent map | "3 opções idiomáticas pra read-heavy 95%? Qual escolher?"            |
|   3 | Context        | "Esse goroutine vaza? Cenário + correção."                           |
|   4 | Idempotência   | "Como garantir exactly-once efetivo em mensageria?"                  |
|   5 | Resilience     | "DB caiu — descreve o fluxo (retry, breaker, DLQ, observabilidade)." |
|   6 | Observability  | "P99 subiu 10x — o que tu olha primeiro? Em que ordem?"              |
|   7 | Deployment     | "Rolling update está quebrando requests. Por quê? Como corrigir?"    |

**Critério "passou"**: 7/7 com confiança, apresentado em voz alta para outra
pessoa do time, sem consultar notas.

---

## Bibliografia consolidada (referências canônicas do curso)

### Livros essenciais

- _Designing Data-Intensive Applications_ — Martin Kleppmann
- _Concurrency in Go_ — Katherine Cox-Buday
- _Release It!_ — Michael Nygard (2nd ed)
- _Observability Engineering_ — Majors, Fong-Jones, Miranda
- _Growing Object-Oriented Software, Guided by Tests_ — Freeman & Pryce
- _Site Reliability Engineering_ (Google SRE Book) — caps 4, 6, 11, 15
- _100 Go Mistakes and How to Avoid Them_ — Teiva Harsanyi

### Papers (em ordem de prioridade)

- Dynamo (2007)
- Raft (2014)
- Spanner (2012)
- "Exponential Backoff And Jitter" (AWS)

### Talks canônicas (YouTube)

- "Concurrency is not parallelism" — Rob Pike
- "TDD: Where Did It All Go Wrong?" — Ian Cooper
- "Errors Are Values" — Rob Pike (post + talks correlatos)
- "The Go Programming Language" — Rob Pike & Ken Thompson (Google Tech Talk)
