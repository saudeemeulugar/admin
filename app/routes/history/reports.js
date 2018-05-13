import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  settings: inject(),
  model() {
    const settings = this.get('settings');

    return  Ember.RSVP.hash({
      historiesCountInStates: this.getHistoriesCountInStates(),
      historiesCountInStatesURL: settings.ENV.API_HOST+'/exports/history-count-in-states.csv',
      usersCountInStates: this.getUsersCountInStates(),
      usersCountInStatesURL: settings.ENV.API_HOST+'/exports/user-count-in-states.csv'
    });
  },

  getHistoriesCountInStates() {
    const settings = this.get('settings');

    return new window.Promise( (resolve, reject)=> {
      Ember.$.ajax({
        url: `${settings.ENV.API_HOST}/exports/history-count-in-states`,
        type: 'GET',
        headers: settings.getHeaders()
      })
      .done( (result)=> {
        if (result.data) {
          result = result.data;
        }

        resolve(result);
        return null;
      })
      .fail( (err)=> {
        if (err.responseJSON) {
          resolve([]);
          err.responseJSON.errors.forEach( (e)=> {
            if (e.errorName === 'SequelizeValidationError') {
              // todo! add an better validation handling here...
              this.get('notifications').error(e.title);
            } else {
              this.get('notifications').error(e.title);
            }
          });
        } else {
          reject(err);
          this.send('error', err);
        }
      });
    });
  },

  getUsersCountInStates() {
    const settings = this.get('settings');

    return new window.Promise( (resolve, reject)=> {
      Ember.$.ajax({
        url: `${settings.ENV.API_HOST}/exports/user-count-in-states`,
        type: 'GET',
        headers: settings.getHeaders()
      })
      .done( (result)=> {
        if (result.data) {
          result = result.data;
        }

        resolve(result);
        return null;
      })
      .fail( (err)=> {
        if (err.responseJSON) {
          resolve([]);
          err.responseJSON.errors.forEach( (e)=> {
            if (e.errorName === 'SequelizeValidationError') {
              // todo! add an better validation handling here...
              this.get('notifications').error(e.title);
            } else {
              this.get('notifications').error(e.title);
            }
          });
        } else {
          reject(err);
          this.send('error', err);
        }
      });
    });
  }
});
