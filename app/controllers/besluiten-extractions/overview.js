import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class BesluitenExtractionsOverviewController extends Controller {
  title = 'Overzicht extracties uit besluiten';
  @service() router;

  get hasActiveChildRoute() {
    return (
      this.router.currentRouteName.startsWith('besluiten-extractions.') &&
      this.router.currentRouteName != 'besluiten-extractions.overview'
    );
  }
}
