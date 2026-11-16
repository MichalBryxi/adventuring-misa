export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Tailwind CSS 4 configures itself in CSS
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'plugin',
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
        ],
      },
    ],
    'import-notation': 'string',
  },
};
