import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';


export default class BesluitenExtractionsNewController extends Controller {
  @tracked url = '';

  // Updates the `url` value as the user types
  @action
  updateUrl(event) {
    this.url = event.target.value;
  }

  @action
  async submitForm(event) {
    event.preventDefault();  // Prevent the page reload

    if (this.url) {
      try {
        let response = await fetch('/pipeline/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ aanduidingsobject: this.url })
        });

        console.log('Form submitted successfully', await response.json());
      } catch (error) {
        console.error('Form submission failed', error);
      }
    }
  }
}
