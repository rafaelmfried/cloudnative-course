# cloud-native-course

[![PR Checks](https://github.com/rafaelmfried/cloudnative-course/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/rafaelmfried/cloudnative-course/actions/workflows/pr-checks.yml)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

Material de treinamento técnico em conceitos cloud-native e práticas de
produção. Construído originalmente para nivelar a equipe de engenharia da
**Tellos**, aberto pra qualquer time ou pessoa que queira refazer o caminho.

Aplicação real (mini-ledger transacional) implementada em Go e Node em
paralelo, evoluindo commit a commit do nível ingênuo até production-ready.

Não é tutorial passivo. Não é livro. É um caderno aberto, com decisões
explícitas, onde o time absorve, discute e ensina uns aos outros.

---

## Por que esse repo existe

Equipes que operam sistemas em produção têm complexidade real à frente
todo dia — mensageria, persistência, concorrência, observabilidade. O
domínio prático está lá, mas nem sempre vem acompanhado da articulação
dos fundamentos: por que esse retry está aqui, por que essa fila é
durable, por que esse context precisa propagar, por que esse circuit
breaker está nesse adapter específico e não no caller.

Esse repo é o nivelamento. Cada membro do time digita 100% do código que
serve de referência — sem IA gerando bloco no editor. Cada decisão tem
motivo escrito no commit. Cada conceito tem que caber numa explicação
clara, em voz alta, sem consultar notas, antes de ser considerado absorvido.

Não substitui experiência de produção. Adiciona a base que sustenta
entender **por que os patterns que usamos existem** — e quando NÃO usá-los.

---

## O que tem aqui

```
cloud-native-course/
├── README.md          este arquivo
├── SYLLABUS.md        os 13 módulos detalhados
├── METHODOLOGY.md     como trabalhar (TDD, git flow, níveis)
├── ROADMAP.md         ordem dos módulos + gates de fechamento
├── modules/           um diretório por módulo
├── app/               a aplicação que evolui módulo a módulo
│   ├── go/            implementação Go
│   ├── node/          implementação Node
│   └── infra/         compose.yaml compartilhado (postgres, rabbit, otel, prom, grafana)
└── docs/              assessments, deep-dives de conceito, ADRs
```

A aplicação é um mini-ledger transacional. Domínio simples o suficiente
pra qualquer pessoa entender em 30s, complexo o suficiente pra forçar
idempotência, concorrência com estado mutável, saga, observabilidade séria.

---

## Como navegar

Como leitor:

- `git log --oneline` é o roteiro. Cada commit tem mensagem-aula com decisão,
  trade-off e armadilha evitada.
- `git show <hash>` traz a aula completa daquele commit.
- README de cada módulo é auto-contido — pode entrar direto no módulo que
  interessa.

Como aluno (refazer o caminho):

1. **Faz fork** desse repositório no GitHub. Trabalha no teu fork — não
   precisa abrir PR no upstream. O fork é o teu portfolio.
2. Clona o fork local e configura upstream:
   ```bash
   git clone git@github.com:<seu-user>/cloud-native-course.git
   cd cloud-native-course
   git remote add upstream <url-do-upstream>
   ```
3. Lê `SYLLABUS.md`, `METHODOLOGY.md`, `ROADMAP.md`.
4. Sobe a infra: `cd app/infra && docker compose up -d`.
5. Entra no módulo 1: `modules/01-foundations/README.md`.
6. Trabalha em branch `module/01-foundations`, segue a metodologia
   (TDD red-green-refactor + commits por nível jr/mid/sr).
7. Ao terminar uma feature, abre PR no **teu fork** (`feature/* → module/*`).
   O GitHub Actions do fork roda checks automatizados de:
   - Conventional Commits (formato + scope)
   - Testes verdes (Go + Node)
   - Lint + type check
   - Heurísticas de metodologia (anti-patterns, testes presentes,
     mensagens-aula com substância)
8. **GitHub Copilot Code Review** revisa o PR usando o contexto definido
   em `.github/copilot-instructions.md` — TDD sequence, hexagonal,
   anti-patterns de Go/Node, observabilidade, idempotência. Resolve os
   comentários antes de mergear.
9. Faz merge no teu fork quando checks + review estão verdes.
10. Só avança pro próximo módulo quando passa o assessment.

Sincronizar com o upstream periodicamente:

```bash
git fetch upstream
git merge upstream/main
```

---

## Os 13 módulos

|   # | Módulo                        | Foco                                    |
| --: | ----------------------------- | --------------------------------------- |
|   1 | Foundations                   | Hexagonal, DI manual, graceful shutdown |
|   2 | Testing pyramid + TDD Chicago | Testcontainers, red-green-refactor      |
|   3 | Concurrency & parallelism     | G/M/P, event loop, locks, leaks         |
|   4 | Error handling & resilience   | Retry, circuit breaker, fail-fast       |
|   5 | Observability                 | OTel, Prom RED/USE, slog/pino, SLO      |
|   6 | Persistence patterns          | Idempotência, transactions, outbox      |
|   7 | Messaging & event-driven      | At-least-once, saga, DLQ                |
|   8 | HTTP & API design             | Status codes, idempotency-key, OpenAPI  |
|   9 | Security                      | OWASP, validation, secrets, HMAC        |
|  10 | Performance & profiling       | pprof, clinic.js, k6                    |
|  11 | Cloud-native deployment       | Distroless, k3d, rolling update         |
|  12 | Distributed systems           | CAP, consistency, replication           |
|  13 | Capstone & integração final   | Postmortem, system design, apresentação |

Detalhe em `SYLLABUS.md`.

---

## Decisões de método

Sem prazo. Módulo dura o que precisar. Travar é parte do processo.

Go e Node em paralelo, no idioma de cada um. Não traduzo sintaxe, comparo
abordagem. Cada módulo fecha com um `COMPARISON.md` listando trade-offs
que apareceram.

TDD Chicago-style, com Testcontainers. Mock só onde não há saída
(provedor externo). Padrão alinha com o que considero não-negociável em
qualquer projeto sério.

Sem commits gigantes. Sem implementação sem teste
vermelho antes.

---

## Pré-requisitos

Programa em alguma linguagem. Entende REST e SQL básicos. Sabe o que é
container. Já leu um README de projeto open source.

Tooling: Docker + Compose v2, Go 1.26+, Node 24+, Make, Git.
Hardware: 8GB RAM (a stack de infra sobe ~10 containers nos módulos finais).

---

## Estado

Em construção. Estrutura fundacional criada, módulo 1 começa em seguida.

A ordem do git log conta o resto.
