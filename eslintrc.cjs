module.exports = {
    root: true,
    extends: '@extensionengine/eslint-config/base',
    rules: {
        'no-control-regex': 0
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    }
}
