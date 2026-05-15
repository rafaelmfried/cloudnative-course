---
name: Tracking de módulo
about: Issue guarda-chuva de um módulo — acompanha os entregáveis até o fechamento
title: "Módulo <N> — <nome> (tracking)"
labels: []
---

> Issue guarda-chuva do módulo. Acompanha os entregáveis até o módulo fechar.
>
> Ao abrir, aplique a label `module/NN`.

## Módulo <N> — <nome>

Material do módulo: `modules/<NN>-<slug>/README.md`

## Objetivo

<!-- O que o módulo entrega, em 2-4 linhas. -->

## Entregáveis

<!-- Task list das issues filhas — o GitHub renderiza o progresso.
     Ex: - [ ] #NN — descrição curta -->

- [ ]

## Ordem de execução

<!-- A sequência de dependência entre as filhas. Ex: 1 → 2 → 3. -->

## Gate de fechamento (ver `ROADMAP.md`)

- [ ] App Go e App Node verdes (testes + lint)
- [ ] `README.md` do módulo revisado / em palavras próprias
- [ ] `COMPARISON.md` com no mínimo 3 trade-offs Go vs Node reais
- [ ] `assessment.md` respondido honestamente
- [ ] Apresentação de 15-30min dada sem consultar notas
- [ ] 7 perguntas de calibração respondidas em < 90s cada

Fechamento: PR `module/<NN>-<slug> → main` + tag `module-<NN>-complete`.
