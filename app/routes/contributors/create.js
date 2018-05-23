import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return {
      record: this.store.createRecord('contributor')
    };
  },
  actions: {
    save(record) {
      record.save()
      .then( (r)=> {
        this.get('notifications').success('Contribuidor cadastrado com sucesso.');
        this.transitionTo('contributors');
        this.send('scrollToTop');
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return null;
      });
    }
  }
});