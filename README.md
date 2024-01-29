NJS01 blysov

## How to run the code:

1. `npm i` to install the packages
2. `node src/task1` to run the code related to fetch, parse and save data to .csv file using workers
    1. `node src/task1-semaphore-version` to run the same code using semaphores
3. `node src/task2-db` to run the code related to get the data from .csv and push to db
4. `node src/task3-db` to run the code related to get the data from db

`settings.json` in VScode, that help to highlight and fix on save the issues:

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
