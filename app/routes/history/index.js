import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  settings: inject(),
  model() {
    const i18n = this.get('i18n');

    return  Ember.RSVP.hash({
      records: this.get('store').query('history', {
      }),
      tablesExportUrl: this.getTablesExportUrl(),
      tableQuery: null,
      columns: [
        {
          propertyName: 'id',
          title: 'ID',
          className: 'mt-c-id'
        },
        {
          propertyName: 'title',
          filteredBy: 'title_contains',
          title: i18n.t('form-content-title'),
          className: 'mt-c-name text-cell'
        },
        {
          propertyName: 'creator.displayName',
          filteredBy: 'creatorName_like',
          disableSorting: true,
          title: i18n.t('content.creator')
        },
        {
          propertyName: 'locationState',
          filteredBy: 'locationState_contains',
          title: 'Estado'
        },
        {
          propertyName: 'published',
          disableSorting: true,
          // disableFiltering: true,
          filterWithSelect: true,
          predefinedFilterOptions: [
            { value: false, label: 'Não' },
            { value: true, label: 'Sim'}
          ],
          title: i18n.t('form-content-published'),
          className: 'mt-c-published'
        },
        {
          propertyName: 'createdAt',
          filteredBy: 'createdAt',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('form-content-createdAt'),
          component: 'mt-list-item-created-at',
          className: 'mt-c-createdAt'
        },
        {
          propertyName: 'actions',
          disableSorting: true,
          disableFiltering: true,
          title: i18n.t('Actions'),
          component: 'mt-actions-history'
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

    return `${settings.ENV.API_HOST}/exports/history.csv` + params;
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
