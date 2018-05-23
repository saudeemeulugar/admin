import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  settings: inject(),
  model() {
    return  Ember.RSVP.hash({
      records: this.get('store').query('contributor', {
      })
    });
  }
});
