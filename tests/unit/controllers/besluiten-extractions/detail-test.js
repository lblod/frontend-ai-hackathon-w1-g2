import { module, test } from 'qunit';
import { setupTest } from 'frontend/tests/helpers';

module('Unit | Controller | besluiten-extractions/detail', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup(
      'controller:besluiten-extractions/detail'
    );
    assert.ok(controller);
  });
});
