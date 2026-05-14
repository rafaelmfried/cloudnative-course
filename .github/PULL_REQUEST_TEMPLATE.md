# Pull Request

## Objetivo

<!-- O que esse PR resolve em 1-3 frases. -->

## Conceito coberto

<!-- Conceito do SYLLABUS + módulo. Ex: "Module 6 — outbox pattern (sr-level)". -->

## Nível

<!-- jr | mid | sr -->

## Tipo de PR

<!-- feature em curso, fechamento de módulo, refatoração, fix -->

- [ ] Feature `feature/* → module/*`
- [ ] Módulo completo `module/* → main`
- [ ] Hotfix / docs

## Checklist obrigatório

- [ ] Testes Go verdes (`go test ./...`)
- [ ] Testes Node verdes (`pnpm test`)
- [ ] Lint Go limpo (`golangci-lint run`)
- [ ] Lint Node limpo (`pnpm lint`)
- [ ] Type check Node limpo (`pnpm typecheck`)
- [ ] Coverage não regrediu
- [ ] README do módulo atualizado (se aplicável)
- [ ] `COMPARISON.md` atualizado se mudou paridade Go/Node
- [ ] Observabilidade implementada onde aplicável (logs estruturados,
      métricas, traces propagando)
- [ ] Errors wrapped corretamente (`%w` em Go, `cause` em Node)
- [ ] Sem implementação sem teste vermelho anterior (TDD Chicago)

## Sequência TDD usada (cole os hashes)

<!--
Exemplo:
- `abc1234` test(red): POST /transactions falha sem idempotency-key
- `def5678` feat(green): minimal accepts idempotency-key header
- `ghi9012` refactor: extract IdempotencyKey to value object
-->

## Trade-offs principais

<!-- Cite as decisões arquiteturais que não são óbvias e o porquê delas. -->

## Notas pro revisor

<!-- O que olhar com atenção. Onde tu mesmo tem dúvida. -->

## Verificação manual

<!-- Como o revisor pode validar localmente. Comandos `make ...`, curls, etc. -->
