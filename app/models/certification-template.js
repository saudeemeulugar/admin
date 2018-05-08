import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  text: DS.attr('string'),
  textPosition: DS.attr('string', {
    defaultValue: 'middle'
  }),
  identifier: DS.attr('string'),
  published: DS.attr('boolean', {
    defaultValue: true
  }),
  certifications: DS.hasMany('certification', {
    inverse: 'template'
  }),

  image: DS.attr('array'),

  linkPermanent: DS.attr('string')
});
