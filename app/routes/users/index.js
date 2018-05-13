import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  settings: inject(),

  model() {
    return  Ember.RSVP.hash({
      users: this.get('store').query('user', {}),
      tablesExportUrl: this.getTablesExportUrl(),
      tableQuery: null,
      columns: [
        {
          propertyName: 'id',
          filteredBy: 'id',
          title: 'ID'
        },
        {
          propertyName: 'displayName',
          filteredBy: 'displayName_starts-with',
          title: 'Nome'
        },
        {
          propertyName: 'email',
          filteredBy: 'email_starts-with',
          title: 'E-mail'
        },
        {
          propertyName: 'cpf',
          filteredBy: 'cpf_starts-with',
          title: 'CPF'
        },
        {
          propertyName: 'fullName',
          filteredBy: 'fullName_starts-with',
          title: 'Nome completo'
        },
        {
          propertyName: 'locationState',
          filteredBy: 'locationState_contains',
          title: 'Estado'
        },
        {
          propertyName: 'active',
          disableSorting: true,
          disableFiltering: true,
          title: 'Active'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: 'Actions',
          component: 'mt-actions-users'
        }
      ]
    });
  },
  getTablesExportUrl(query) {
    const settings = this.get('settings');
    let params = '?';

    if (query) {
      for(let key in query) {
        if (key === 'limit' || key === 'page') {
          continue;
        }

        params+= key+'='+query[key]+'&';
      }
    }

    return `${settings.ENV.API_HOST}/exports/user.csv` + params;
  },

  actions: {
    updateQuery(query) {
      this.set(
        'currentModel.tablesExportUrl',
        this.getTablesExportUrl(query)
      );
    }
  }
});
