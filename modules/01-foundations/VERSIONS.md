# VERSIONS — Módulo 1

> **Entregável do aluno.** Este arquivo é um template. Os campos marcados
> com `<...>` são pra você preencher — pesquisando, não chutando. Preencher
> este arquivo é o **primeiro exercício do módulo**.
>
> Trabalhe na sua branch (`feature/versions` derivada de
> `module/01-foundations`). Se travar, a branch de referência do curso
> mostra uma versão preenchida — consulte só depois de tentar.

---

## Por que este arquivo existe

Versão de dependência não é detalhe de setup — é decisão de arquitetura.
A versão que você escolhe hoje define:

- Por quanto tempo você recebe **patch de segurança**.
- Se o próximo `bump` vai ser tranquilo ou um incidente.
- Se outra pessoa consegue reproduzir seu build seis meses depois.

Documentar a escolha — com fonte e justificativa — força a decisão a ser
**consciente**. "Peguei a que o tutorial usava" não é resposta aceitável
em produção.

---

## Como pesquisar uma versão (método)

Para **runtime / linguagem** (Go, Node), responda nesta ordem:

1. **Qual o status de suporte da versão?**
   `Current` → instável, não-produção.
   `Active LTS` → recebe features + fixes, **é o que produção usa**.
   `Maintenance LTS` → só security fix, saída próxima — não comece projeto aqui.
   `EOL` → sem patch nenhum, risco aberto.
2. **Até quando recebe security patch?** A data de EOL importa mais que
   o número da versão.
3. **A escolha é Active LTS?** Se não for, justifique muito bem.

Para **bibliotecas**, antes de adicionar:

1. Ler o **CHANGELOG** das últimas versões — procurar `BREAKING CHANGE`.
2. Avaliar maturidade: frequência de release, issues abertas vs fechadas,
   se há release recente corrigindo CVE.
3. Confirmar que existe **lockfile** travando a versão transitiva.

Para **infra** (DB, broker, observability):

1. Preferir `stable` > `LTS` > `latest` quando o componente é core.
2. Major bump em componente **com dados persistentes** exige plano de
   migração — não é trocar a tag da imagem.

### Fontes oficiais (use estas, não blog aleatório)

| Tipo                   | Fonte                                                 |
| ---------------------- | ----------------------------------------------------- |
| Ciclo de vida geral    | <https://endoflife.date>                              |
| Go                     | <https://go.dev/doc/devel/release>                    |
| Node.js                | <https://nodejs.org/en/about/previous-releases>       |
| pnpm                   | <https://github.com/pnpm/pnpm/releases>               |
| Bibliotecas (genérico) | página de Releases / CHANGELOG no repositório oficial |
| Imagens de container   | Docker Hub / registry oficial do projeto              |

Regra: **cruze duas fontes**. `endoflife.date` resume; a fonte oficial confirma.

---

## Exemplo de formato (como preencher uma linha)

> Linha ilustrativa — não é um componente real do projeto, é só pra
> mostrar o nível de detalhe esperado:

| Componente       | Versão  | Status       | Suporte até | Fonte          | Justificativa                                                     |
| ---------------- | ------- | ------------ | ----------- | -------------- | ----------------------------------------------------------------- |
| _ExemploRuntime_ | _4.2.x_ | _Active LTS_ | _2027-09_   | _link oficial_ | _Active LTS com a maior janela de suporte; a 5.x ainda é Current_ |

---

## Tabela de versões — PREENCHA

### Runtime / linguagem

| Componente | Versão    | Status                  | Suporte até                         | Fonte                                   | Justificativa                                                                                                                                                                                                                                                                         |
| ---------- | --------- | ----------------------- | ----------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Go         | `1.26.3`  | `Latest stable release` | `≈ 02/2027 (lançamento do Go 1.28)` | `https://go.dev/doc/devel/release`              | `Go não tem LTS — suporta só as duas releases mais recentes. 1.26 é a atual e dá a maior janela antes de exigir bump: cai só quando o 1.28 sair; a 1.25 já cai no 1.27.`                                                                                                              |
| Node.js    | `24.15.0` | `Active LTS`            | `30/04/2028`                        | `https://nodejs.org/en/about/previous-releases` | `Versões pares entram no ciclo LTS. A v26 (Current) ainda não entrou na janela LTS — não serve pra produção. A 22 é a LTS par anterior, mas já está em Maintenance LTS, com EOL mais cedo. A 24 é a versão par em Active LTS — a maior janela de suporte entre as opções de produção` |

### Gerenciador de pacotes / build

| Componente    | Versão    | Status           | Fonte                                                                             | Justificativa                                                                                                                                                                                                                                                              |
| ------------- | --------- | ---------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pnpm          | `11.1.2`  | `latest release` | `https://github.com/pnpm/pnpm/releases · https://pnpm.io/supply-chain-security`                   | `pnpm não tem ciclo LTS — usa-se a estável mais recente. A major 11 traz, por padrão, o minimumReleaseAge: atrasa a instalação de versões recém-publicadas (default 1 dia), reduzindo a exposição a um pacote comprometido — o risco de supply chain tratado no Módulo 1.` |
| golangci-lint | `v2.12.2` | `latest release` | `https://github.com/golangci/golangci-lint/releases · https://golangci-lint.run/docs/welcome/faq` | `golangci-lint não tem LTS — segue SemVer, usa-se a release mais recente. Ele suporta versões de Go ≤ à usada para compilá-lo; como a v2.12.2 (05/2026) é posterior ao Go 1.26, foi compilada com Go ≥ 1.26 e o suporta plenamente — casando com o runtime do projeto.`    |

### Bibliotecas — Go

| Componente                                               | Versão    | Fonte (CHANGELOG)                   | Justificativa                                                                                                                                                                                                           |
| -------------------------------------------------------- | --------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| caarlos0/env                                             | `v11.3.1` | `https://github.com/caarlos0/env/releases`  | `Estável mais recente da major v11. SemVer; CHANGELOG sem BREAKING CHANGE recente — bump seguro dentro da major. Lib madura de configuração por variáveis de ambiente.`                                                 |
| godotenv                                                 | `v1.5.1`  | `https://github.com/joho/godotenv/releases` | `Última versão estável — as 2 releases acima são pre-release, que não vão para produção. SemVer, sem BREAKING CHANGE recente. Lib pequena e madura (carrega .env em dev); estabilidade longa é esperada, não abandono.` |
| _(`log/slog` é stdlib — sem versão própria, segue o Go)_ | —         | —                                   | —                                                                                                                                                                                                                       |

### Bibliotecas — Node

| Componente | Versão    | Fonte (CHANGELOG)                          | Justificativa                                                                                                                                                                  |
| ---------- | --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript | `6.0.3`   | `https://github.com/microsoft/TypeScript/releases` | `Linha estável atual, mantida pela Microsoft com cadência trimestral. Releases de TypeScript podem trazer breaking change de checagem de tipos a qualquer minor — mas o projeto é novo, sem código a migrar, então não pesa.`                                                   |
| Fastify    | `v5.8.5`  | `https://github.com/fastify/fastify/releases`      | `Major 5 é a linha estável atual. Projeto começa do zero → adota-se a major corrente direto, sem custo de migração da v4. Framework HTTP do curso no lado Node.`               |
| Pino       | `v10.3.1` | `https://github.com/pinojs/pino/releases`          | `Major 10, linha estável atual. Logger estruturado (JSON) usado a partir do nível mid. SemVer, sem BREAKING CHANGE recente que pese.`                                          |
| Zod        | `v4.4.3`  | `https://github.com/colinhacks/zod/releases`       | `Major 4 é a estável atual (sucede a v3 com mudança de API e performance). Projeto novo adota a v4 direto, sem migração. Usada na config tipada com fail-fast.`                |
| Vitest     | `v4.1.6`  | `https://github.com/vitest-dev/vitest/releases`    | `Última versão estável (linha 4.1.x). O Vitest 5 está em beta — prerelease não vai pra produção, mesma regra aplicada ao godotenv. SemVer. Test runner do curso no lado Node.` |

### Infra (imagens de container)

| Componente              | Versão / tag            | Tipo     | Fonte                                                        | Justificativa                                                                                                                                                                                                                 |
| ----------------------- | ----------------------- | -------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PostgreSQL              | `18-alpine`             | `stable` | `https://endoflife.date/postgresql`                                  | `Major estável atual (lançada 09/2025), EOL 14/11/2030 — 5 anos de suporte. Variante alpine reduz o tamanho da imagem.`                                                                                                       |
| RabbitMQ                | `4.3-management-alpine` | `stable` | `https://endoflife.date/rabbitmq`                                    | `Série estável mais recente (lançada 04/2026). A variante management inclui a UI de administração; alpine enxuga a imagem.`                                                                                                   |
| Prometheus              | `v3.5.0`                | `LTS`    | `https://prometheus.io/docs/introduction/release-cycle`              | `LTS mais recente do Prometheus (EOL 31/07/2026). Releases não-LTS recebem fix por só ~6 semanas — inviável para infra de curso. Débito conhecido: bump para a próxima LTS quando sair (~07/2026) — ver Política de upgrade.` |
| Grafana Tempo           | `2.9.0`                 | `stable` | `https://github.com/grafana/tempo/releases`                          | `Série estável atual. Backend de traces do stack de observabilidade.`                                                                                                                                                         |
| Grafana Loki            | `3.7.2`                 | `stable` | `https://github.com/grafana/loki/releases`                           | `Série estável mais recente. Backend de logs do stack de observabilidade.`                                                                                                                                                    |
| Grafana                 | `13.0.1`                | `stable` | `https://endoflife.date/grafana`                                     | `Major estável atual (lançada 04/2026), suporte ativo até 09/01/2027. UI de visualização do stack.`                                                                                                                           |
| OpenTelemetry Collector | `0.152.0`               | `stable` | `https://github.com/open-telemetry/opentelemetry-collector-releases` | `Distribuição contrib (receivers/exporters extras). Projeto ainda em 0.x — versão fixada exata para build reproduzível.`                                                                                                      |

---

## Onde travar cada versão — PREENCHA

Saber a versão não basta; ela tem que estar **travada** num arquivo que o
build respeita. Liste, pra cada componente, qual arquivo o trava:

| Componente       | Arquivo que trava                                        | Por que ali                                                                                                                                      |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Go               | `.tool-versions` + diretiva `go` no `go.mod`             | asdf lê o `.tool-versions` e fixa a versão exata em qualquer máquina/CI; a diretiva `go` declara a versão mínima da linguagem que o módulo exige |
| Node.js          | `.tool-versions` + `engines` no `package.json`           | asdf fixa o runtime; `engines` declara e valida a faixa de Node aceita pelo projeto                                                              |
| pnpm             | campo `packageManager` no `package.json`                 | o corepack lê esse campo e usa a versão exata do pnpm — time e CI no mesmo gerenciador                                                           |
| Bibliotecas Go   | `go.mod` (diretas) + `go.sum` (lockfile)                 | `go.mod` lista as diretas; `go.sum` trava os hashes de todas, diretas e transitivas — build reproduzível                                         |
| Bibliotecas Node | `package.json` (manifesto) + `pnpm-lock.yaml` (lockfile) | `package.json` declara os ranges; `pnpm-lock.yaml` trava a árvore exata resolvida                                                                |
| Imagens de infra | `app/infra/compose.yaml`                                 | arquivo que o `docker compose` lê; cada serviço tem a tag fixada ali, nunca `latest`                                                             |

---

## Política de upgrade — PREENCHA

Defina a política que **este projeto** vai seguir. Use o conceito de semver
(`MAJOR.MINOR.PATCH`) pra decidir o nível de cautela de cada tipo de bump:

- **Patch** (`x.y.Z`): baixo risco — só correção de bug/segurança, sem mudança de API. Aplicar com frequência via PR do Dependabot, mergeando com CI verde. O `minimumReleaseAge` do pnpm já segura versões recém-saídas por 1 dia.
- **Minor** (`x.Y.0`): risco baixo-médio — novas features retrocompatíveis. Aplicar via PR, lendo o CHANGELOG antes — não mergear no automático. CI verde obrigatório.
- **Major** (`X.0.0`): risco alto — breaking changes. Nunca automático. Exige ler o guia de migração, branch dedicada, ajustar o código, CI + testes verdes, e registrar a decisão (atualizar este `VERSIONS.md`).
- **Infra com dados persistentes**: major bump (ex: Postgres) não é trocar a tag — exige plano de migração, backup antes e rollback testado. Débito conhecido: Prometheus `v3.5.0` LTS expira em 31/07/2026 — bump para a próxima LTS planejado para ~07/2026. Plano de contingência se a próxima LTS atrasar: manter a `v3.5.0` sob monitoramento por algumas semanas até a nova LTS sair — não migrar para release não-LTS, que recebe fix por só ~6 semanas.

---

## Checklist do entregável

- [x] Toda linha `<...>` preenchida — sem campo em branco.
- [x] Toda versão tem **fonte oficial** linkada (não blog, não Stack Overflow).
- [x] Toda escolha de runtime declara o **status de suporte** e justifica
      por que não é uma versão mais nova nem mais antiga.
- [x] A política de upgrade está definida e faz sentido pro contexto.
- [x] Você consegue explicar, em voz alta, por que escolheu cada versão.
