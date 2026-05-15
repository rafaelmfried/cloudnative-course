# Módulo 1 — Foundations & Project Setup

> A lição zero do curso. Antes de escrever uma linha de código de domínio,
> o aluno toma três decisões que vão custar caro de mudar depois:
> **qual versão usar**, **como isolar dependências**, e **como estruturar
> o projeto**.

---

## Por que começar aqui

Quase todo curso de backend pula essa parte. Manda o aluno `npm install`
e `go mod init` e segue pro código. O problema aparece seis meses depois,
em produção: a lib que ninguém leu o changelog quebrou num minor bump, o
runtime está numa versão que saiu de suporte, e trocar qualquer coisa
significa tocar em quarenta arquivos porque nada foi isolado.

Esse módulo trata versionamento e isolamento como o que eles são: **decisões
de arquitetura**. Não é burocracia de setup — é o que separa um upgrade
tranquilo de um incidente de madrugada.

A regra que guia o módulo: **depois que tem produção rodando em cima de uma
escolha, mudar essa escolha custa caro — e custa mais quanto pior foi o
isolamento.**

---

## O que você vai construir

Duas aplicações HTTP — uma em Go, uma em Node — funcionalmente idênticas,
cada uma expondo dois endpoints:

- `GET /healthz` — liveness probe. Responde enquanto o processo está vivo.
- `GET /readyz` — readiness probe. Responde apenas enquanto o processo
  está apto a receber tráfego.

Não tem domínio de negócio ainda. O ponto do módulo não é o que a app faz —
é **como ela é construída, versionada e desligada**.

Cada app evolui em três níveis, cada um um conjunto de commits:

| Nível   | O que caracteriza                                                             |
| ------- | ----------------------------------------------------------------------------- |
| **jr**  | Funciona. Tudo no `main`, config hard-coded, sem shutdown limpo.              |
| **mid** | Idiomático. Config tipada com fail-fast, handler isolado, logger estruturado. |
| **sr**  | Production-ready. Graceful shutdown, readiness drena no shutdown.             |

Você vê os três. O diff entre eles é a aula — mostra **o que evitar**, não
só o que fazer.

---

## Conceitos cobertos

### Seleção de versão

- Diferença real entre **Current**, **Active LTS**, **Maintenance LTS** e
  **EOL**. "É LTS" não basta — Active LTS e Maintenance LTS são coisas
  diferentes, e começar projeto novo em Maintenance é herdar dívida.
- Onde pesquisar: release schedule oficial do projeto + `endoflife.date`.
  Cruzar as duas fontes.
- Como **travar** a versão: `.tool-versions` (asdf), `go.mod` directive,
  `package.json` `engines` + `packageManager`. Por que travar — build
  reproduzível, onboarding sem surpresa, CI determinístico.

### Seleção de dependências

- Ler o **CHANGELOG antes de adicionar** uma lib. Procurar BREAKING CHANGES.
  Bumpar lib sem ler changelog é causa raiz de incidente.
- Avaliar maturidade de verdade — não por stars, mas por: issues abertas
  vs fechadas, frequência de release, releases recentes corrigindo CVE.
- **Lockfile é obrigatório** (`go.sum`, `pnpm-lock.yaml`). Sem lockfile,
  o build não é reproduzível — duas máquinas instalam coisas diferentes.
- Risco de **supply chain**: pacote comprometido publicado e baixado antes
  de alguém detectar. Ferramentas modernas mitigam isso (ex: pnpm 11 segura
  versões recém-publicadas por um período por padrão).

### Seleção de versão de infra

- **Stable > LTS > latest** quando o componente é core. Neste curso usamos
  Prometheus LTS em vez do latest justamente por isso.
- Major bump em infra **com dados persistentes** (Postgres, por exemplo)
  não é trocar a tag da imagem — exige plano de migração, backup, rollback.
- Nunca `latest` em produção. `latest` é build não-reproduzível esperando
  pra acontecer.

### Isolamento de dependências

- O domínio **não conhece** a lib externa. Ele conhece uma interface
  (porta); o adapter implementa usando a lib.
- Trocar a lib = mexer só no adapter. Se mexeu em mais lugares, o
  isolamento estava fraco.
- Config tipada **centralizada** — variável de ambiente é lida uma vez,
  validada, e injetada. Não vira `os.Getenv` espalhado.

### Estrutura, config, logs, shutdown

- Estrutura idiomática: `cmd/` + `internal/` em Go, `src/` em Node.
- Config tipada com **fail-fast**: variável faltando derruba o boot, não
  vira bug em runtime três horas depois.
- Logger estruturado (JSON) desde o início — `log.Println` / `console.log`
  não escala.
- **Graceful shutdown**: o processo recebe SIGTERM, para de aceitar
  conexões novas, drena as em andamento, e sai limpo.
- **liveness vs readiness**: `/healthz` diz "estou vivo" (se falhar, o
  orquestrador reinicia). `/readyz` diz "estou apto a receber tráfego"
  (se falhar, o orquestrador para de mandar requests, mas não reinicia).
  Confundir os dois quebra deploy.

---

## Pré-requisitos

- Programa em Go **ou** Node — não precisa dominar as duas, o curso
  ensina a leitura cruzada.
- Entende HTTP/REST básico (métodos, status codes).
- Sabe o que é um container e tem Docker + Docker Compose v2 instalados.
- Leu ao menos um README de projeto open source de verdade.

Tooling necessário (versões definidas no `VERSIONS.md` do módulo):
asdf (ou equivalente), Go, Node, pnpm, Make, Git.

---

## Lab — passo a passo

> Siga a metodologia do curso (`METHODOLOGY.md`): TDD Chicago, commits
> red-green-refactor, branches `feature/*` derivadas de `module/01-foundations`.

1. **Pesquisar e travar versões.** Antes de qualquer código, preencher o
   `VERSIONS.md` — cada componente (linguagem, libs, infra) com versão,
   status de suporte, fonte oficial e justificativa. Esse arquivo é o
   primeiro entregável.

2. **Subir a infra.** `cd app/infra && docker compose up -d`. Confirmar
   que a stack sobe (não vamos usar tudo agora, mas o ambiente tem que
   estar de pé).

3. **Scaffold.** Criar a estrutura mínima de cada app — `go.mod` +
   `cmd/api`, `package.json` + `src/`. Travar as versões pesquisadas no
   passo 1.

4. **Nível jr.** Implementar `/healthz` e `/readyz` da forma ingênua:
   tudo no `main`, porta hard-coded, sem shutdown. Via TDD — teste
   vermelho primeiro.

5. **Nível mid.** Refatorar: config tipada com fail-fast, handler extraído
   pra pacote próprio, logger estruturado.

6. **Nível sr.** Adicionar graceful shutdown e fazer `/readyz` retornar
   503 durante o drain de shutdown.

7. **Experimento de isolamento.** Trocar uma lib não-core de propósito
   (ex: o logger). Medir: quantos arquivos mudaram? 1-2 = isolamento bom.
   Mais que isso = refatorar antes de seguir.

8. **COMPARISON.md.** Registrar os trade-offs Go vs Node que apareceram
   no caminho. Mínimo 3, idealmente 5-6.

9. **Assessment.** Responder o `assessment.md` honestamente — incluindo o
   que ainda não souber.

10. **Apresentar.** Explicar o módulo pra outra pessoa do time, sem
    consultar notas. Se não conseguir, o módulo não fechou.

---

## Como rodar

```bash
# Infra compartilhada
cd app/infra && docker compose up -d

# App Go
cd app/go && make run        # sobe a API
cd app/go && make test-race  # testes

# App Node
cd app/node && pnpm dev      # sobe a API
cd app/node && pnpm test     # testes
```

Validar os endpoints:

```bash
curl -i localhost:8080/healthz   # 200
curl -i localhost:8080/readyz    # 200
# mandar SIGTERM e observar: /readyz vira 503, conexões drenam, processo sai limpo
```

---

## Critério de fechamento

O módulo está fechado quando **todos** os itens abaixo estão verdes:

- [ ] App Go e App Node sobem, respondem `/healthz` e `/readyz`, fazem
      shutdown limpo em SIGTERM.
- [ ] Config faltando = falha no boot, não em runtime.
- [ ] `VERSIONS.md` preenchido com versão, status de suporte, fonte
      oficial e justificativa de cada componente.
- [ ] `COMPARISON.md` com no mínimo 3 trade-offs Go vs Node reais.
- [ ] Testes verdes nas duas linguagens (`make test-race` / `pnpm test`),
      lint limpo.
- [ ] `assessment.md` respondido honestamente.
- [ ] Você consegue responder: **"se eu precisar trocar a lib X amanhã,
      quantos arquivos eu mexo?"** — resposta de 1-2 arquivos indica bom
      isolamento.
- [ ] Apresentação do módulo dada pra outra pessoa, sem notas.

---

## Referências

- **The Twelve-Factor App** — [12factor.net](https://12factor.net) — em
  especial os fatores _Dependencies_ e _Config_.
- **endoflife.date** — [endoflife.date](https://endoflife.date) — ciclo de
  vida de runtimes e ferramentas.
- **Go release policy** — [go.dev/doc/devel/release](https://go.dev/doc/devel/release)
- **Node.js release schedule** — [nodejs.org/en/about/previous-releases](https://nodejs.org/en/about/previous-releases)
- **Semantic Versioning** — [semver.org](https://semver.org)
- **"Choose Boring Technology"** — Dan McKinley — [boringtechnology.club](https://boringtechnology.club)
- **Kubernetes — Liveness, Readiness and Startup Probes** —
  [kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
- Talk: **"Practical Go: Real World Advice"** — Dave Cheney —
  [dave.cheney.net/practical-go](https://dave.cheney.net/practical-go/qcon-china.html)
