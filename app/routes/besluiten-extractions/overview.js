import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BesluitenExtractionsOverviewRoute extends Route {
  @service store;

  model() {
    return this.store.query('job', { include: 'source,source.besluiten' });
  }
}
