import EmberRouter from '@embroider/router';

import config from './config/environment.ts';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// Same URLs as the old empress-blog site, so links out there keep working
Router.map(function () {
  this.route('changelog');
  this.route('post', { path: '/:post_id' });
  // Before page: a page of its own, at the URL it always had
  this.route('about-me', { path: '/page/about-me' });
  this.route('page', { path: '/page/:page_id' });
  this.route('not-found', { path: '/*path' });
});
