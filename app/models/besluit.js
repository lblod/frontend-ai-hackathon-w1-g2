import Model, { attr, belongsTo } from '@ember-data/model';

export default class BesluitModel extends Model {
  @attr('string') titel;
  @attr('string') uri;
  @attr('date') publicatiedatum;
}
