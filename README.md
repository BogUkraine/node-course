NJS01 blysov

`settings.json` in VScode:

```
{
    "[json]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "vscode.json-language-features",
        "editor.quickSuggestions": {
            "strings": true
        },
        "editor.suggest.insertMode": "replace",
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[yaml]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "eslint.format.enable": true,
    "eslint.lintTask.enable": true,
    "eslint.codeActionsOnSave.rules": null,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.validate": [
        "javascript",
        "typescript",
    ],
    "eslint.runtime": "",
    "eslint.run": "onSave",
    "eslint.debug": true,
    "eslint.trace.server": "verbose",
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.detectIndentation": true
}
```

husky command to init: `npx husky-init && npm install`
