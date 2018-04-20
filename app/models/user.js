import DS from 'ember-data';

export default DS.Model.extend({
  totalScore: DS.attr('number'),
  displayName: DS.attr('string'),
  username: DS.attr('string'),
  fullName: DS.attr('string'),
  biography: DS.attr('string'),
  gender: DS.attr('string'),
  email: DS.attr('string'),
  active: DS.attr('boolean'),
  blocked: DS.attr('boolean'),
  language: DS.attr('string'),
  roles: DS.attr(),

  slides: DS.hasMany('slide', {
    inverse: 'creator',
    async: true
  }),

  contents: DS.hasMany('content', {
    inverse: 'creator',
    async: true
  }),
  comments: DS.hasMany('comment', {
    inverse: 'creator',
    async: true
  }),
  news: DS.hasMany('news', {
    inverse: 'creator',
    async: true
  }),

  vocabularies: DS.hasMany('vocabulary', {
    inverse: 'creator',
    async: true
  }),

  actions: DS.hasMany('treasure-action', {
    inverse: 'creator',
    async: true
  }),

  linkPermanent: DS.attr('string'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  avatar: DS.attr('array')
});