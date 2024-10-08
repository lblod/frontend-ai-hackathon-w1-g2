import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service() router;

  get isIndexPage() {
    return this.router.currentRouteName == 'index';
  }
}
