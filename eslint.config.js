const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  ignores: ['**/*.md/*.{js,ts,vue,json}'],
})
