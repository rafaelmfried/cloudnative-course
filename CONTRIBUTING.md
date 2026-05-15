# Contributing — cloudnative-course

Este repositório é material de treinamento. O fluxo de contribuição é,
ele mesmo, parte do que o curso ensina: gitflow disciplinado, PRs
revisados, branches protegidas.

---

## Fluxo de fork (como o aluno trabalha)

1. **Fork** deste repositório pra sua conta GitHub.
2. Clone o fork e configure o upstream:
   ```bash
   git clone git@github.com:<seu-user>/cloudnative-course.git
   cd cloudnative-course
   git remote add upstream git@github.com:<upstream-owner>/cloudnative-course.git
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

- **Nunca commitar direto em `main`** — só via PR.
- **Nunca commitar direto em `module/*`** — só via PR de `feature/*`.
- Branch de feature é mergeada com `--no-ff` (preserva o agrupamento no
  `git log --graph`).
- Ao fechar o módulo: PR `module/<NN>-* → main` + tag `module-<NN>-complete`.

Convenção de nomes:

- `module/01-foundations`, `module/02-testing-pyramid`, ...
- `feature/jr`, `feature/mid`, `feature/sr`, `feature/scaffold-go`, ...

> Rulesets do GitHub não restringem o **nome da branch de origem** de um
> PR — só protegem o destino. Por isso o `pr-checks.yml` tem um job
> `Branch naming convention` que enforça o gitflow: um PR para `module/*`
> que não venha de `feature/*` falha o check. O naming não é só
> convenção — é verificado.

---

## Revisão de PR — o modelo solo

Cada aluno trabalha **sozinho no próprio fork**. No GitHub, o autor de um
PR não pode aprová-lo — então exigir "aprovação de revisor" travaria
todo merge num fork de uma pessoa só.

Por isso os rulesets usam `required_approving_review_count: 0`. A revisão
**não** desaparece — ela vem de três camadas que **continuam obrigatórias**:

1. **PR obrigatório** — nada entra em `main` ou `module/*` por push direto.
2. **Checks verdes** — `pr-checks.yml` (Conventional Commits, metodologia,
   testes, lint) tem que passar.
3. **GitHub Copilot Code Review** — comenta o PR usando
   `.github/copilot-instructions.md`. Os comentários viram threads, e o
   ruleset exige **todas as threads resolvidas** antes do merge
   (`required_review_thread_resolution`).

Some-se a isso a **auto-revisão consciente**: antes de mergear, leia o
próprio diff inteiro no PR, como se fosse de outra pessoa. O hábito de
revisar o próprio código é o que o modelo solo treina.

> Num time real, `required_approving_review_count` volta a fazer sentido
> — aí outra pessoa aprova. O `0` aqui é uma decisão específica do
> modelo "um aluno, um fork", não um relaxamento de qualidade.

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
- **GitHub Copilot Code Review** — habilitar nas configurações do fork.
- **Aprovação de PR por GitHub Actions** — a opção "Allow GitHub Actions
  to create and approve pull requests" (Settings → Actions → General) não
  é herdada. Sem ela o comando `/approve` falha: o `github-actions[bot]`
  não consegue submeter reviews aprovadas.

---

## Rulesets — aplicar no seu fork

Os rulesets garantem que nada entra na `main` sem PR + checks verdes.
Uma vez só, por fork:

### Via UI (recomendado)

1. No seu fork: **Settings → Rules → Rulesets → New ruleset → Import a ruleset**.
2. Importe `.github/rulesets/protect-main.json`.
3. Repita pra `.github/rulesets/protect-module-branches.json`.

### Via gh CLI

```bash
gh api repos/<seu-user>/cloudnative-course/rulesets \
  --method POST --input .github/rulesets/protect-main.json

gh api repos/<seu-user>/cloudnative-course/rulesets \
  --method POST --input .github/rulesets/protect-module-branches.json
```

### O que cada ruleset garante

| Ruleset                   | Aplica a   | Garante                                                                        |
| ------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `protect-main`            | `main`     | PR obrigatório, checks verdes, threads resolvidas, sem force-push, sem deleção |
| `protect-module-branches` | `module/*` | PR obrigatório, checks verdes, threads resolvidas                              |

> **Status checks obrigatórios**: os rulesets exigem `Conventional Commits`
> e `Methodology heuristics` — os dois jobs do `pr-checks.yml` que sempre
> rodam. Os jobs de build/test/lint de Go e de Node são condicionais (só
> rodam se Go ou Node mudou), por isso **não** entram como required — um
> check condicional que não roda ficaria "pending" pra sempre e travaria
> o merge. Se você quiser forçá-los, adicione um job "gate" final no
> workflow que sempre roda e depende dos demais, e marque só esse gate
> como required.

---

## Camadas de proteção (resumo)

| Camada                            | Garante                                                   |
| --------------------------------- | --------------------------------------------------------- |
| Ruleset `protect-main`            | Nada entra na `main` sem PR + checks + threads resolvidas |
| Ruleset `protect-module-branches` | `feature → module` passa por PR                           |
| `pr-checks.yml`                   | Conventional Commits, naming, testes, lint, heurísticas   |
| Copilot Code Review               | Revisão contextual via `copilot-instructions.md`          |
| `CODEOWNERS`                      | Define quem é notificado pra revisar                      |
| `commitlint.config.js`            | Formato de mensagem de commit                             |

A regra de ouro: **tudo que é versionável vive no repo** (workflows,
configs, JSON de ruleset, CODEOWNERS) pra que o fork nasça o mais
próximo possível do padrão. O que não é versionável fica como passo
manual por fork — importar os rulesets, habilitar o Copilot Code Review
e a flag de aprovação por Actions — tudo no checklist abaixo.

---

## Comandos de PR via comentário

Inspirado no chat-ops do Prow (Kubernetes), o `command-handler.yml`
interpreta comandos escritos em comentários de pull request. Restrito a
mantenedores e colaboradores do repositório.

| Comando                                  | Efeito                                               |
| ---------------------------------------- | ---------------------------------------------------- |
| `/approve`                               | Submete uma review aprovada no PR                    |
| `/lgtm`                                  | Aplica a label `lgtm`                                |
| `/hold` · `/unhold`                      | Aplica/remove `do-not-merge/hold` — bloqueia o merge |
| `/label <nome>` · `/remove-label <nome>` | Gerencia uma label                                   |
| `/assign [@user]`                        | Atribui o PR (a quem comentou, se sem `@user`)       |
| `/unassign [@user]`                      | Remove a atribuição                                  |
| `/cc @user`                              | Solicita review de alguém                            |
| `/help`                                  | Comenta a lista de comandos                          |

Um comentário pode conter vários comandos, um por linha. `/hold` casa
com o `wip-guard.yml`: enquanto a label `do-not-merge/hold` estiver
presente, o merge fica bloqueado.

> Nota: `/approve` submete a review como o `github-actions[bot]` — exige
> que "Allow GitHub Actions to create and approve pull requests" esteja
> habilitado no fork (ver checklist). A review **não** conta para
> `required_approving_review_count` de branch protection — mas o ruleset
> deste curso usa `count: 0`, então o valor do comando é o registro de
> processo, não desbloquear o merge.

---

## Checklist de setup do fork (uma vez)

- [ ] Fork criado e clonado
- [ ] `upstream` configurado como remote
- [ ] `protect-main` importado nos rulesets do fork
- [ ] `protect-module-branches` importado
- [ ] `CODEOWNERS` editado pro seu usuário
- [ ] GitHub Copilot Code Review habilitado no fork (Settings → Copilot)
- [ ] "Allow GitHub Actions to create and approve pull requests" habilitado
      (Settings → Actions → General → Workflow permissions) — necessário
      pro comando `/approve`
