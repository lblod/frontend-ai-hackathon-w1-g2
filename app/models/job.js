import Model, { attr, belongsTo } from '@ember-data/model';

export default class JobModel extends Model {
  @attr('date') created;
  @attr('string') operation;
  @attr('string') status;
  
  @belongsTo("aanduidingsobject") source;
}
