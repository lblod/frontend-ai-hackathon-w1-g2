import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { validateForm } from '@lblod/ember-submission-form-fields';
import { action } from '@ember/object';
import { graph, parse } from 'rdflib';

export default class BesluitenExtractionsDetailController extends Controller {
  @tracked datasetTriples = [];
  @tracked forceShowErrors = false;

  constructor() {
    super(...arguments);
  }

  get formStore() {
    return this.model.formStore;
  }

  get graphs() {
    return this.model.graphs;
  }

  get sourceNode() {
    return this.model.sourceNode;
  }

  get form() {
    return this.model.form;
  }

  registerObserver() {
    // this.formStore.registerObserver(() => {
    //   this.setTriplesForTables();
    // });
  }

  // setTriplesForTables() {
  //   this.datasetTriples = this.formStore.match(
  //     undefined,
  //     undefined,
  //     undefined,
  //     this.graphs.sourceGraph
  //   );
  // }

  @action
  async save() {
    const triples = this.formStore.serializeDataWithAddAndDelGraph(
      this.graphs.sourceGraph
    );
    const tempInsertStore = graph();
    //parse(triples.graph, tempInsertStore, 'http://foo', 'text/turtle');
    parse(triples.additions, tempInsertStore, 'http://foo', 'text/turtle');
    const ttlInsert = tempInsertStore.toNT();

    const insertQuery = `
    INSERT DATA {
        GRAPH <http://mu.semte.ch/graphs/public>
        ${ttlInsert}
     }`;

    await saveInDB(insertQuery);
    const result = validateForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });

    this.forceShowErrors = !result;

    alert(`Uw referentie: ${this.sourceNode}`);
  }
}

async function saveInDB(query) {
  const endpoint = '/sparql';
  const body = encodeURI(`query=${query}&format=text/html`);
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
}
