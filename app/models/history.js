import DS from 'ember-data';

import Inflector from 'ember-inflector';
const inflector = Inflector.inflector;
inflector.irregular('history', 'history');
inflector.uncountable('history');

export default DS.Model.extend({
  published: DS.attr('boolean', {
    defaultValue: false
  }),
  highlighted: DS.attr('number', {
    defaultValue: 0
  }),
  showInLists: DS.attr('boolean', {
    defaultValue: true
  }),
  allowComments: DS.attr('boolean', {
    defaultValue: false
  }),
  title: DS.attr('string'),
  about: DS.attr('string'),
  body: DS.attr('string'),
  creator: DS.belongsTo('user', {
    inverse: 'histories',
    async: true
  }),

  country: DS.attr('string'),
  locationState: DS.attr('string'),
  city: DS.attr('string'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  publishedAt: DS.attr('date'),
  tags: DS.attr(),
  category: DS.attr('array'),
  featuredImage: DS.attr('array'),
  images: DS.attr('array'),
  attachment: DS.attr('array'),

  youtubeVideoUrl: DS.attr('string'),

  setAlias: DS.attr('string'),
  linkPermanent: DS.attr('string')
});