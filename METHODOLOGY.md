# METHODOLOGY — Como Trabalhar Neste Curso

> A metodologia é metade do valor. Sem disciplina aqui, vira coleção de
> tutoriais lidos passivamente. Com disciplina, vira **transformação real
> de senioridade**.

---

## 1. TDD Chicago-style por commit

### Por que Chicago, não London

| Aspecto       | London (mockist)                  | Chicago (classicist)          |
| ------------- | --------------------------------- | ----------------------------- |
| Colaboradores | Mock                              | Real (Testcontainers)         |
| Foco          | Behavior verification             | State verification            |
| Refatoração   | Mexe em mocks também              | Refatora sem mexer em teste   |
| Risco         | Testes que passam mas prod quebra | Testes mais lentos, mas reais |

Este curso adota **Chicago**. Primeiro porque é mais realista (mock não é produção). Segundo porque é mais difícil — força o aluno a entender o sistema como um todo, não só a interface. Mock é permitido **só em último caso**, quando recurso externo não pode ser containerizado (provedor de pagamento sandbox, por exemplo).

### Ciclo de cada feature

```
1. Red:      escrever teste que FALHA
   git commit -m "test(red): <feature> — describe expected behavior"

2. Green:    implementação MÍNIMA que faz passar (sem qualidade ainda)
   git commit -m "feat(green): <feature> — minimal passing implementation"

3. Refactor: melhorar sem quebrar
   git commit -m "refactor: <feature> — extract X, simplify Y"
```

**Regra de ouro**: nunca escrever código de produção sem teste vermelho antes.
Nunca escrever teste verde sem teste vermelho antes. Nunca refatorar sem teste verde antes.

### Quando pular TDD (exceções honestas)

- **Prototipagem exploratória** — quando você ainda não sabe o que tá
  construindo. Pode codificar livre, **mas o commit final do protótipo é
  separado, e a partir dele vira branch nova com TDD do zero**.
- **Configuração de infra** (Dockerfile, compose, migrations) — não tem como
  testar no sentido TDD. Aqui o "teste" é o lab do módulo subir e responder.

---

## 2. Evolução por nível (jr → mid → sr)

Cada feature relevante é implementada **3 vezes** em commits separados:

```
feat(jr): <feature> — naive working implementation
    ↓ (após estudar trade-offs)
feat(mid): <feature> — idiomatic + error handling + structured logs
    ↓ (após estudar production patterns)
feat(sr): <feature> — observability + idempotency + edge cases
```

### O que muda entre níveis

| Aspecto      | Junior                        | Pleno                              | Sênior                                  |
| ------------ | ----------------------------- | ---------------------------------- | --------------------------------------- |
| Erros        | `panic` ou `throw`            | Retorna error / classe customizada | Wrapped + sentinel + observabilidade    |
| Concorrência | Sequencial ou goroutine solta | Worker pool + WaitGroup            | + circuit breaker + bulkhead            |
| Persistência | INSERT direto                 | + transaction                      | + idempotency + outbox                  |
| Logs         | `fmt.Println` / `console.log` | slog/pino estruturado              | + trace_id + correlation                |
| Testes       | Happy path                    | Happy + error paths                | + edge cases + property-based onde cabe |
| Config       | Hard-coded                    | Env vars                           | Tipada + fail-fast + sub-structs        |

### Por que ensinar os 3 níveis em vez de pular pro sênior

1. **Aluno vê o que evitar**, não só o que fazer.
2. **Trade-offs ficam visíveis**: por que NÃO fazer naive aqui?
3. **Currículo realista**: aluno chega no curso fazendo nível jr/mid — não dá
   pra projetar do zero direto no sr.
4. **Útil pra ensinar a equipe** — diferentes membros estão em níveis diferentes.

---

## 3. Git Flow

### Hierarquia de branches

```
main                                    ← protegida, só PR aprovado
 └─ module/<NN>-<slug>                   ← branch por módulo
    └─ feature/<descritivo>              ← branch por feature dentro do módulo
       └─ task/<task-id>-<slug>          ← branch por task dentro da feature (opcional)
```

### Regras

1. **Nunca commit direto em `main`** — só via PR aprovado.
2. **Nunca commit direto em `module/*`** — só via PR de feature.
3. Branch de feature **é mergeada com `--no-ff`** pra preservar o agrupamento
   visível no `git log --graph`.
4. **Tag ao fim de cada módulo**: `module-NN-complete` na main.
5. **Sem push de `main` que viole**: lint, testes, ou metodologia.

### Conventional Commits — formato obrigatório

```
<type>(<scope>): <subject>

<body com explicação rica: decisão + porquê + armadilha evitada>

<footer com refs>
```

Types permitidos:

- `feat` — nova feature
- `fix` — correção de bug
- `refactor` — mudança sem alterar comportamento
- `test` — adicionar/ajustar testes (use `test(red): ...` no ciclo TDD)
- `docs` — documentação
- `chore` — manutenção (deps, build, ci)
- `perf` — melhoria de performance
- `style` — formatação (raro)

Scopes permitidos (alinhar com camada do módulo):
`config`, `domain`, `broker`, `storage`, `http`, `cmd/<bin>`, `infra`, `docs`,
`deps`, `ci`, ou nome do módulo (`module-3`).

### Exemplo de commit-aula

```
feat(sr): POST /transactions — idempotency-key with response cache

Implementa idempotência forte estilo Stripe: mesma idempotency-key retorna
sempre a mesma resposta (incluindo status code), mesmo que a request mude.

DECISÕES:
- Hash SHA-256 do body normalized comparado em INSERT — se request mudou
  com mesma key, retorna 422 conflict (não 200 silencioso, evita bug
  do cliente que reusou key sem perceber).
- Response cache em tabela separada (idempotency_responses) com TTL 24h
  e LRU eviction via job. Não cresce sem limite.
- Lock pessimista (SELECT FOR UPDATE) no insert da key — evita race
  entre 2 requests simultâneas com mesma key.

ARMADILHA EVITADA: a implementação ingênua (idempotency_key UNIQUE +
ON CONFLICT DO NOTHING) deixa a 2ª request com response vazia / 0 status.
Cliente vê "sucesso" mas não recebe o resultado real da 1ª request.

REF: Stripe API Idempotency docs.
```

---

## 4. Pull Requests

### Quando abrir PR

- Ao fim de cada **feature** dentro do módulo: PR `feature/* → module/NN-*`.
- Ao fim do **módulo completo**: PR `module/NN-* → main`.

### O que cada PR exige (template forçado em `.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Objetivo

<o que esse PR resolve em 1-3 frases>

## Conceito coberto

<conceito do SYLLABUS + módulo>

## Nível (jr/mid/sr)

<jr | mid | sr>

## Checklist

- [ ] Testes verdes (`go test ./...` e/ou `pnpm test`)
- [ ] Coverage não regrediu
- [ ] Lint limpo (`golangci-lint run`, `eslint`)
- [ ] README do módulo atualizado se aplicável
- [ ] COMPARISON.md atualizado se mudou paridade Go/Node
- [ ] Observabilidade implementada (logs estruturados + métricas + traces)
- [ ] Errors wrapped e propagados corretamente

## Notas de revisão

<o que o revisor deve olhar com atenção>
```

### Revisão automatizada do PR

Toda vez que um PR é aberto/atualizado, dois sistemas revisam:

1. **GitHub Actions** (`.github/workflows/pr-checks.yml`) — checks
   programáticos: Conventional Commits via commitlint, `go test` +
   `go vet` + `golangci-lint`, `pnpm test` + lint + typecheck,
   heurísticas (anti-patterns clássicos, testes presentes pra cada
   feature, mensagens-aula com substância).

2. **GitHub Copilot Code Review** — análise contextual usando o arquivo
   `.github/copilot-instructions.md` como guia: TDD sequence, hexagonal,
   observabilidade quando aplicável, idempotência nos módulos 6+,
   anti-patterns de Go e Node.

Resolve os comentários antes de mergear. Camadas complementares — Action
pega o programático, Copilot pega o subjetivo.

---

## 5. Ritmo de estudo sugerido

### Por módulo

| Atividade                                                                          | % do tempo |
| ---------------------------------------------------------------------------------- | ---------- |
| Estudar conceito (livros, papers, posts)                                           | 40%        |
| Implementar manualmente (digitar)                                                  | 40%        |
| Documentar (README do módulo, COMPARISON.md)                                       | 10%        |
| Praticar articulação (responder perguntas do assessment em voz alta, cronometrado) | 10%        |

### Por sessão

- **2-3 horas focadas** no máximo. Pomodoro 50/10 se ajudar.
- **Sem multitasking**. Notifications off. Slack/Telegram off.
- **Cabo aterrado** — sem nuvem de IA gerando código no IDE durante implementação.
  IA fica fora do editor durante "modo digitar". Pode usar pra perguntar
  conceito em sessão de estudo.

### Princípio anti-pressa

Se o aluno não consegue **explicar pra equipe sem consultar notas**, módulo
não está fechado. **Travado é melhor que avançar sem absorver**. Pode revisitar
módulo anterior — não é regressão, é integração.

---

## 6. Como medir progresso (sem ego inflado)

### Por módulo

- [ ] Implementação Go e Node verdes
- [ ] Testes Go e Node verdes
- [ ] README do módulo escrito (próprias palavras, não copy)
- [ ] COMPARISON.md preenchido com trade-offs reais
- [ ] Assessment respondido em `docs/assessments/NN-*.md`
- [ ] Apresentação de 15-30min preparada (pode ser pra equipe, pra esposa,
      pra gravador) e dada **sem consultar notas**.

### Por curso

- 7 perguntas de calibração respondidas em < 90s cada, em apresentação
  cronometrada para outra pessoa do time.
- Apresentação final gravada, revisada por par sênior.
- Self-scorecard honesto por módulo (gaps explicitados).

---

## 7. Anti-padrões deste próprio curso

Coisas que **violam a metodologia** e devem ser evitadas:

| Anti-padrão                                                     | Por que mata o curso                                           |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| Copiar código do README e colar                                 | Aluno não digitou = não internalizou                           |
| Skippar TDD "porque é só prototipo"                             | Hábito de pular vira regra; perde a disciplina                 |
| Implementar nível sr sem ter feito jr/mid                       | Não viu o trade-off, só recebeu a "resposta certa"             |
| Avançar de módulo sem fechar checkpoint                         | Curso vira lista de tópicos lidos, não absorvidos              |
| Mockar pra "ir mais rápido"                                     | Mata o aprendizado de Testcontainers — exatamente o gap Sênior |
| Commit gigante "feat: módulo 3 inteiro"                         | Perde o roteiro de aula no git log                             |
| Pedir IA pra gerar código fora de momentos didáticos explícitos | Volta exatamente ao gap que motivou o curso                    |

---

## 8. Ferramentas integradas

- **GitHub Actions** — `.github/workflows/pr-checks.yml` aciona checks
  programáticos em cada PR.
- **GitHub Copilot Code Review** — usa `.github/copilot-instructions.md`
  pra revisar PRs com contexto da metodologia.
- **Commitlint** — `commitlint.config.js` enforça Conventional Commits.

---

## 9. Resumo executivo (TL;DR)

1. **TDD Chicago** com Testcontainers — sem mock.
2. **Red → Green → Refactor** em commits separados.
3. **Junior → Pleno → Sênior** — 3 implementações da feature, 3 commits.
4. **Conventional Commits** com body rico (decisão + porquê + armadilha).
5. **Aluno digita 100% do código**. IA fora do editor.
6. **Profundidade > velocidade**. Módulo dura o que precisar.
7. **Não avança sem dar a aula sem notas**.
