import Route from '@ember/routing/route';
import { ForkingStore } from '@lblod/ember-submission-form-fields';
import { NamedNode, Namespace } from 'rdflib';

const FORM_GRAPHS = {
  formGraph: new NamedNode('http://data.lblod.info/form'),
  metaGraph: new NamedNode('http://data.lblod.info/metagraph'),
  sourceGraph: new NamedNode(`http://data.lblod.info/sourcegraph`),
};

const FORM = new Namespace('http://lblod.data.gift/vocabularies/forms/');
const RDF = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

export default class BesluitenExtractionsDetailRoute extends Route {
  async model(params) {
    const formName = 'extractie-details';

    let [formTtl, metaTtl, dataTtl] = await Promise.all([
      fetchForm(formName),
      fetchFormMeta(formName),
      fetchFormData(formName),
    ]);

    let formStore = new ForkingStore();
    formStore.parse(formTtl, FORM_GRAPHS.formGraph, 'text/turtle');
    formStore.parse(metaTtl, FORM_GRAPHS.metaGraph, 'text/turtle');
    formStore.parse(dataTtl, FORM_GRAPHS.sourceGraph, 'text/turtle');

    let form = formStore.any(
      undefined,
      RDF('type'),
      FORM('Form'),
      FORM_GRAPHS.formGraph
    );

    this.form = form;
    this.formStore = formStore;

    const randomIdentifier = randomId();

    const sourceNode = new NamedNode(`https://aanvragen.onroerenderfgoed.be/aanduidingsobjecten/toelatingsaanvragen/${randomIdentifier}`);
    const triples = [
      {
        subject: sourceNode,
        predicate: new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        object: new NamedNode("https://inventaris.onroerenderfgoed.be/aanvraag"),
        graph: FORM_GRAPHS.sourceGraph
      },
      {
        subject: sourceNode,
        predicate: new NamedNode('http://mu.semte.ch/vocabularies/core/uuid'),
        object: `${randomIdentifier}`,
        graph: FORM_GRAPHS.sourceGraph
      }
    ];

    // formStore.parse(`${sourceNode} a <https://inventaris.onroerenderfgoed.be/aanvraag>.`, FORM_GRAPHS.sourceGraph, 'text/turtle');
    // formStore.parse(`${sourceNode} <http://mu.semte.ch/vocabularies/core/uuid> "${randomIdentifier}".`, FORM_GRAPHS.sourceGraph, 'text/turtle');

    formStore.addAll(triples);

    return {
      formName,
      form,
      formStore,
      title: 'Overzich extracties besluit {UUD}',
      graphs: FORM_GRAPHS,
      sourceNode: sourceNode,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.datasetTriples = [];
    controller.registerObserver();
   // controller.setTriplesForTables();
  }
}

async function fetchForm(formName) {
  let response = await fetch(getFormDataPath(formName, 'form.ttl'));
  let ttl = await response.text();

  return ttl;
}

async function fetchFormMeta(formName) {
  let response = await fetch(getFormDataPath(formName, 'meta.ttl'));
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  }
  return '';
}

async function fetchFormData(formName) {
  let response = await fetch(getFormDataPath(formName, 'data.ttl'));
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  }
  return '';
}

function getFormDataPath(formName, fileName) {
  return `/besluiten-extracties/${formName}/${fileName}`;
}


function randomId() {
  const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomNumber;
}
