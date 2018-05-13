import Ember from 'ember';
import { getOwner } from '@ember/application';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('ENV', getOwner(this).resolveRegistration('config:environment'));
  },
  actions: {
    deleteRecord() {
      this.sendAction('deleteRecord', ...arguments);
    }
  }
});
