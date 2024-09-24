import EmberRouter from '@ember/routing/router';
import config from 'frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('editor');

  this.route('besluiten-extractions', function () {
    this.route('overview');
    this.route('detail', { path: '/:id/detail' });
    this.route('new');
  });
});
