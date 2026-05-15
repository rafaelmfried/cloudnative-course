# Changelog

Todas as mudanças relevantes deste repositório são documentadas aqui.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).
O projeto evolui por **módulos** — cada módulo concluído marca uma versão.

## [Não lançado]

### Adicionado

- Estrutura fundacional do repositório: `README`, `SYLLABUS`,
  `METHODOLOGY`, `ROADMAP`.
- Infraestrutura compartilhada (`app/infra/`): Docker Compose com
  Postgres, RabbitMQ, OpenTelemetry Collector, Prometheus, Tempo, Loki,
  Grafana.
- Automação de repositório: workflow de PR checks, `commitlint`,
  instruções para o Copilot Code Review, template de PR.
- Governança: `CODEOWNERS`, branch rulesets, `CONTRIBUTING`.
- Governança OSS: `LICENSE` (CC BY-SA 4.0), `CODE_OF_CONDUCT`,
  `SECURITY`, este `CHANGELOG`, `.editorconfig`, `dependabot`,
  templates de issue.
- Material do Módulo 1 — Foundations: `README` do módulo, `VERSIONS`,
  `assessment`, `COMPARISON`.

## Convenção de versionamento

- `module-NN-complete` — tag criada quando um módulo é concluído.
- Não há versão semântica de produto — o curso não é um pacote
  distribuído, é material que cresce módulo a módulo.
