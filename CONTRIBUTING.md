# Contributing — cloud-native-course

Este repositório é material de treinamento. O fluxo de contribuição é,
ele mesmo, parte do que o curso ensina: gitflow disciplinado, PRs
revisados, branches protegidas.

---

## Fluxo de fork (como o aluno trabalha)

1. **Fork** deste repositório pra sua conta GitHub.
2. Clone o fork e configure o upstream:
   ```bash
   git clone git@github.com:<seu-user>/cloud-native-course.git
   cd cloud-native-course
   git remote add upstream git@github.com:<upstream-owner>/cloud-native-course.git
   ```
3. Aplique a proteção do fork (ver seção "Rulesets" abaixo) — uma vez só.
4. Trabalhe seguindo o gitflow. PRs são abertos **no seu próprio fork**,
   não no upstream.
5. Sincronize com o upstream periodicamente:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

---

## Gitflow

```
main
 └─ module/<NN>-<slug>          ← branch por módulo
    └─ feature/<descritivo>     ← branch por feature dentro do módulo
```

Regras:

- **Nunca commitar direto em `main`** — só via PR aprovado.
- **Nunca commitar direto em `module/*`** — só via PR de `feature/*`.
- Branch de feature é mergeada com `--no-ff` (preserva o agrupamento no
  `git log --graph`).
- Ao fechar o módulo: PR `module/<NN>-* → main` + tag `module-<NN>-complete`.

Convenção de nomes:

- `module/01-foundations`, `module/02-testing-pyramid`, ...
- `feature/jr`, `feature/mid`, `feature/sr`, `feature/scaffold-go`, ...

> GitHub rulesets **não forçam o padrão de nome** de branch na criação.
> O naming é por convenção — disciplina do aluno. O que os rulesets
> forçam é a _proteção_ de `main` e `module/*` (PR obrigatório, checks
> verdes). Ver abaixo.

---

## O que é herdado pelo fork (e o que não é)

**Herdado automaticamente** (são arquivos versionados):

- `.github/workflows/pr-checks.yml` — checks de CI em cada PR
- `.github/copilot-instructions.md` — contexto pro Copilot Code Review
- `.github/PULL_REQUEST_TEMPLATE.md` — template de PR
- `.github/CODEOWNERS` — donos de revisão
- `commitlint.config.js` — regras de Conventional Commits
- `.github/rulesets/*.json` — definições de ruleset (mas ver abaixo)

**NÃO herdado** — precisa ser configurado em cada fork:

- **Rulesets ativos** — a _definição_ (JSON) vem versionada, mas o
  ruleset _ativo_ não é herdado. Cada fork precisa importar.
- **Branch protection settings** da aba Settings.

---

## Rulesets — aplicar no seu fork

Os rulesets garantem que nada entra na `main` sem PR + checks verdes.
São 3 passos, uma vez só, por fork:

### Via UI (recomendado)

1. No seu fork: **Settings → Rules → Rulesets → New ruleset → Import a ruleset**.
2. Importe `.github/rulesets/protect-main.json`.
3. Repita pra `.github/rulesets/protect-module-branches.json`.

### Via gh CLI

```bash
gh api repos/<seu-user>/cloud-native-course/rulesets \
  --method POST --input .github/rulesets/protect-main.json

gh api repos/<seu-user>/cloud-native-course/rulesets \
  --method POST --input .github/rulesets/protect-module-branches.json
```

### O que cada ruleset garante

| Ruleset                   | Aplica a   | Garante                                                              |
| ------------------------- | ---------- | -------------------------------------------------------------------- |
| `protect-main`            | `main`     | PR obrigatório, 1 review, checks verdes, sem force-push, sem deleção |
| `protect-module-branches` | `module/*` | PR obrigatório de `feature/*`, checks verdes                         |

> **Status checks obrigatórios**: os rulesets exigem `Conventional Commits`
> e `Methodology heuristics` — os dois jobs do `pr-checks.yml` que
> **sempre rodam**. Os jobs `Go — build, test, lint` e `Node — build,
> test, lint` são condicionais (só rodam se Go/Node mudou), por isso
> **não** entram como required — um check condicional que não roda
> ficaria "pending" pra sempre e travaria o merge. Se você quiser
> forçá-los, adicione um job "gate" final no workflow que sempre roda e
> depende dos demais, e marque só esse gate como required.

---

## Sem fork (mantenedor / solo no upstream)

Se você é o mantenedor e trabalha direto no upstream, aplique os mesmos
rulesets uma vez. Mesmo solo, eles forçam a disciplina: você não
consegue dar push direto na `main`, é obrigado a passar por PR.

Pra "auto-revisão consciente", ative `require_code_owner_review` no
`protect-main.json` (hoje está `false`) e mantenha o `CODEOWNERS`
apontando pra você.

---

## Camadas de proteção (resumo)

| Camada                            | Garante                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| Ruleset `protect-main`            | Nada entra na `main` sem PR + checks + review                  |
| Ruleset `protect-module-branches` | `feature → module` passa por PR                                |
| `pr-checks.yml`                   | Conventional Commits, testes, lint, heurísticas de metodologia |
| Copilot Code Review               | Revisão contextual via `copilot-instructions.md`               |
| `CODEOWNERS`                      | Define quem aprova                                             |
| `commitlint.config.js`            | Formato de mensagem de commit                                  |

A regra de ouro: **tudo que é versionável vive no repo** (workflows,
configs, JSON de ruleset, CODEOWNERS) pra que o fork nasça o mais
próximo possível do padrão. O único passo manual por fork é importar
os rulesets.

---

## Checklist de setup do fork (uma vez)

- [ ] Fork criado e clonado
- [ ] `upstream` configurado como remote
- [ ] `protect-main` importado nos rulesets do fork
- [ ] `protect-module-branches` importado
- [ ] `CODEOWNERS` editado pro seu usuário
- [ ] GitHub Copilot Code Review habilitado no fork (Settings → Copilot)
