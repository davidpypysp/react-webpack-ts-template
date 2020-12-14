module.exports = {
    env: {
        browser: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    extends: ["plugin:react/recommended", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true,
        },
        ecmaVersion: 11,
        sourceType: "module",
    },
    plugins: ["react", "prettier", "@typescript-eslint"],
    rules: {
        "react-prop-types": 0,
        "max-classes-per-file": 0,
        "react-jsx-filename-extension": 0,
        "react/display-name": 0,
        "no-console": ["warn", { allow: ["warn", "error"] }],
        semi: ["error", "always"],
        curly: "error",
        eqeqeq: "error",
        "no-eval": "error",
        "require-await": "warn",
        yoda: "error",
        "new-cap": [
            "error",
            {
                newIsCap: true,
                capIsNew: false,
            },
        ],
        "new-parens": "error",
        "no-trailing-spaces": "error",
        "arrow-spacing": "error",
        "no-const-assign": "error",
        "no-useless-constructor": "warn",
        "no-var": "warn",
        "prefer-const": "warn",
        "max-len": ["warn", 80],
        indent: ["warn", 4, { SwitchCase: 1 }],
        "prettier/prettier": [
            "warn",
            {
                printWidth: 80,
                tabWidth: 4,
            },
        ],
    },
};
