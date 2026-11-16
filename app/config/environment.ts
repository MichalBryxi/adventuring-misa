const ENV = {
  modulePrefix: 'adventuring-misa',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/',
  locationType: 'history',
  EmberENV: {},
  APP: {} as Record<string, unknown>,
};

export default ENV;
