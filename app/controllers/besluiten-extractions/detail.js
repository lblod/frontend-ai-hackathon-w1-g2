import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { validateForm } from '@lblod/ember-submission-form-fields';
import { action } from '@ember/object';
import { graph, NamedNode, parse } from 'rdflib';

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
    this.formStore.registerObserver(() => {
      this.setAdditionsTriplesForTables();
    });
  }

  setAdditionsTriplesForTables() {
    //hard coded abstraction breaking. It's hackaton!
    const addGraph = new NamedNode(`http://mu.semte.ch/libraries/rdf-store/graphs/add?for=http%3A%2F%2Fdata.lblod.info%2Fsourcegraph`);
    this.datasetTriples = this.formStore.graph.match(
      undefined,
      undefined,
      undefined,
      addGraph
    );
  }

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
