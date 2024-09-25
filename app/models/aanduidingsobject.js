import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AanduidingsobjectModel extends Model {
  @hasMany('besluit') besluiten;
  @attr('string') uri;
}
