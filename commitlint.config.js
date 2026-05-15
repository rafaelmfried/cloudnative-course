// Conventional Commits enforcement.
// Veja METHODOLOGY.md seção "Conventional Commits" pro porquê.

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "test",
        "docs",
        "chore",
        "perf",
        "style",
        "ci",
        "build",
      ],
    ],
    "scope-enum": [
      1, // warn, não error — permite scopes do tipo module-NN
      "always",
      [
        // Camadas
        "config",
        "domain",
        "broker",
        "storage",
        "http",
        "infra",
        "deps",
        "ci",
        "docs",

        // Comandos
        "cmd/api",
        "cmd/worker",
        "cmd/publisher",
        "cmd/consumer",

        // Níveis (usados em feat/refactor pra marcar progressão)
        "jr",
        "mid",
        "sr",
        "green",
        "red",
      ],
    ],
    // Permite scopes "module-NN" via pattern adicional
    "scope-empty": [0],
    "subject-case": [2, "never", ["upper-case", "pascal-case", "start-case"]],
    "subject-max-length": [2, "always", 72],
    "body-max-line-length": [1, "always", 100],
  },
};
