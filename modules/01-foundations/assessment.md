# Assessment — Módulo 1

> **Entregável do aluno.** As 7 perguntas abaixo são fixas. Os campos de
> resposta (`<...>`) são pra você preencher — com suas palavras, depois de
> implementar o módulo inteiro.
>
> Este não é um quiz de múltipla escolha. É calibração: serve pra você
> (e pra quem revisa) saber o que de fato foi absorvido.

---

## Como fazer

1. Termine o módulo — código jr/mid/sr, VERSIONS.md, COMPARISON.md.
2. Responda cada pergunta **por escrito**, com suas palavras. Não copie
   do README nem do SYLLABUS.
3. Depois, responda cada uma **em voz alta**, cronometrado: a meta é
   menos de 90 segundos, sem consultar nada.
4. Marque honestamente o nível de confiança. "Travei" não é vergonha —
   é informação. Travar em 2+ perguntas = revisar antes do Módulo 2.

Confiança: ✅ respondi fluido · 🟡 respondi com esforço · ❌ travei

---

## As 7 perguntas

### 1. Status de suporte de runtime

Explique a diferença entre **Current**, **Active LTS** e **Maintenance
LTS**. Por que um projeto novo em produção deve nascer em Active LTS — e
não na versão mais nova nem numa Maintenance?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 2. Liveness vs readiness

`/healthz` é liveness, `/readyz` é readiness. O que cada endpoint sinaliza
pro orquestrador? O que o orquestrador faz quando **cada um** falha? Por
que confundir os dois quebra um deploy?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 3. Graceful shutdown

Entre receber `SIGTERM` e o processo morrer, o que a aplicação precisa
fazer? Por que `/readyz` deve passar a responder 503 nesse intervalo,
enquanto `/healthz` continua 200?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 4. Config tipada com fail-fast

Por que ler e validar toda a config **uma vez no boot**, em vez de chamar
`os.Getenv` / `process.env` espalhado pelo código? O que exatamente o
fail-fast previne — e quando o bug apareceria sem ele?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 5. Isolamento de dependência

Você precisa trocar o logger (Pino / slog) por outro amanhã. Num código
bem isolado, **quantos arquivos** mudam? Por quê? O que, na estrutura,
torna isso possível — e o que aconteceria se o logger fosse usado direto
em todo lugar?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 6. Lockfile e build reproduzível

O que um lockfile (`go.sum`, `pnpm-lock.yaml`) garante que o `go.mod` /
`package.json` sozinhos não garantem? O que o `--frozen-lockfile` faz no
`pnpm install` da CI, e por que isso importa em produção?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

### 7. Versão de imagem de container

Qual a diferença prática entre uma tag como `postgres:18` e
`postgres:18-alpine`? E por que usar `postgres:18` é melhor que
`postgres:latest` num arquivo de deploy?

**Resposta:**
`<...>`

**Confiança:** `<✅ | 🟡 | ❌>`

---

## Auto-avaliação honesta

Depois de responder as 7:

- Perguntas que respondi fluido (✅): `<...>`
- Perguntas que travei (❌) ou custaram (🟡): `<...>`
- O que eu preciso revisar antes do Módulo 2: `<...>`

---

## Critério de fechamento

- [ ] As 7 perguntas respondidas por escrito, com palavras próprias.
- [ ] As 7 respondidas em voz alta, < 90s cada, sem consultar notas.
- [ ] No máximo 1 pergunta com ❌. Se houver 2+, revisar e refazer.
- [ ] Auto-avaliação preenchida com honestidade — gaps explicitados.
