import EmberRouter from '@embroider/router';

import config from './config/environment.ts';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

// Same URLs as the old empress-blog site, so links out there keep working
Router.map(function () {
  this.route('post', { path: '/:post_id' });
  this.route('page', { path: '/page/:page_id' });
  this.route('tag', { path: '/tag/:tag_id' });
  this.route('author', { path: '/author/:author_id' });
  this.route('not-found', { path: '/*path' });
});
