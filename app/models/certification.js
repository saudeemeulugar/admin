import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  name: DS.attr('string'),
  text: DS.attr('string'),
  identifier: DS.attr('string'),
  user: DS.belongsTo('user', {
    inverse: 'certifications'
  }),
  template: DS.belongsTo('certificationTemplate', {
    inverse: 'certifications'
  }),

  downloadUrl: computed('user.id', function() {
    const userId = this.get('user.id');
    const id = this.get('id');
    if (!userId || !id) {
      return null;
    }

    return '/user/'+userId+'/certification/'+id+'/download.pdf';
  }),

  linkPermanent: DS.attr('string')
});