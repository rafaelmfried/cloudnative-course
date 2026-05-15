# COMPARISON — Módulo 1: Go vs Node

> **Entregável do aluno.** Preencha este arquivo **ao final do módulo**,
> depois de ter implementado a app nas duas linguagens. Os campos `<...>`
> são pra você. A branch de referência do curso traz uma versão preenchida
> como tip — consulte só depois de tentar.

---

## Por que este arquivo existe

Implementar a mesma coisa em Go e em Node lado a lado só vale se você
**colher o que aprendeu**. Cada linguagem resolve o mesmo problema de um
jeito diferente, e cada jeito tem um custo.

Este arquivo não é "qual linguagem é melhor" — essa pergunta não tem
resposta. É **"o que cada escolha custa, e em que contexto cada uma
vence"**. Saber articular isso é a diferença entre ter opinião e ter
critério.

Regra: **não traduza sintaxe, compare abordagem.** "Em Go usa `:=`, em
Node usa `const`" não é um trade-off — é trivia. "Go retorna erro como
valor, Node lança exceção; isso muda como o fluxo de controle é desenhado"
é um trade-off.

---

## Como preencher

Para cada dimensão, registre quatro coisas:

1. **Como Go faz** — a abordagem idiomática, não a sintaxe.
2. **Como Node faz** — idem.
3. **Trade-off** — o que cada lado ganha e perde. Tem que ter perda dos
   dois lados; se um lado só ganha, você não entendeu o trade-off.
4. **Quando cada um vence** — o contexto concreto que faz pender pra um lado.

Mínimo **3 dimensões** preenchidas. Ideal **5-6**. Se você encontrou
trade-offs além dos slots abaixo, adicione.

---

## Exemplo de formato

> Dimensão ilustrativa (genérica) — só pra mostrar o nível esperado:

### 0. Gerenciamento de dependência _(exemplo)_

- **Go:** _módulo único, `go.mod` + `go.sum`, sem `node_modules`; binário
  final não carrega dependências._
- **Node:** _`package.json` + lockfile + `node_modules` em disco; runtime
  resolve módulos em tempo de execução._
- **Trade-off:** _Go entrega um artefato auto-contido (deploy simples),
  ao custo de recompilar pra qualquer mudança. Node tem hot-reload e
  troca de dependência sem rebuild, ao custo de carregar `node_modules`
  no ambiente de runtime e resolução dinâmica._
- **Quando cada um vence:** _Go pra deploy imutável e imagem pequena;
  Node pra iteração rápida em dev._

---

## Trade-offs — PREENCHA

### 1. Estrutura de projeto

> `cmd/` + `internal/` no Go vs `src/` no Node.

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 2. Config tipada

> `caarlos0/env` (struct tags, parse em runtime) vs `zod` (schema,
> validação + inferência de tipo).

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 3. Logger estruturado

> `log/slog` (stdlib) vs `pino` (biblioteca externa).

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 4. Graceful shutdown

> `signal.NotifyContext` + `http.Server.Shutdown` vs
> `process.on('SIGTERM')` + `fastify.close`.

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 5. HTTP server

> `net/http` da stdlib vs `Fastify` (framework externo).

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 6. Modelo de erro

> Erro como valor de retorno (Go) vs exceção lançada / `Promise` rejeitada
> (Node).

- **Go:** `<...>`
- **Node:** `<...>`
- **Trade-off:** `<...>`
- **Quando cada um vence:** `<...>`

### 7+. Outros trade-offs que você encontrou

> Espaço livre. Sistema de tipos, concorrência (mesmo que mínima neste
> módulo), tooling, o que tiver aparecido.

`<...>`

---

## Síntese — PREENCHA

Depois de preencher as dimensões, feche com uma leitura geral:

- **Go se mostrou mais forte quando:** `<...>`
- **Node se mostrou mais forte quando:** `<...>`
- **A escolha entre os dois, neste tipo de serviço, dependeria de:**
  `<...>`

---

## Checklist do entregável

- [ ] No mínimo 3 dimensões preenchidas (ideal 5-6).
- [ ] Cada trade-off mostra **perda dos dois lados** — nenhum lado só ganha.
- [ ] Nenhum item é comparação de sintaxe — todos comparam abordagem.
- [ ] A síntese final foi preenchida com base no que você viveu
      implementando, não em opinião de blog.
- [ ] Você consegue defender, em voz alta, qualquer um dos trade-offs
      que escreveu.
