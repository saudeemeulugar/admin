import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  i18n: inject(),
  settings: inject(),

  // beforeModel() {
  //   return Ember.RSVP.hash({
  //     searchOptions: this.getSearchOptions()
  //   });
  // },

  model() {
    // const so = this.get('settings.processSearchOptions') || {};

    const i18n = this.get('i18n');

    return  Ember.RSVP.hash({
      filterString: '',
      records: this.get('store').query('history', {
      }),
      tablesExportUrl: this.getTablesExportUrl(),
      tableQuery: null,
      // searchOptions: so,
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

  // getSearchOptions() {
  //   const settings = this.get('settings');

  //   return new window.Promise((resolve, reject)=> {
  //     if (settings.get('processSearchOptions')) {
  //       return resolve(settings.get('processSearchOptions'));
  //     }

  //     return Ember.$.ajax({
  //       url: settings.ENV.API_HOST + '/history-search-options',
  //       type: 'get',
  //       cache: true,
  //       headers: settings.getHeaders()
  //     })
  //     .then( (response)=> {
  //       console.log('response>', response);

  //       settings.set('processSearchOptions', response);

  //       resolve(response);
  //     })
  //     .fail( (err)=> {
  //       reject(err);
  //     });
  //   });
  // },

  actions: {
    updateQuery(query) {
      this.set(
        'currentModel.tablesExportUrl',
        this.getTablesExportUrl(query)
      );
    }
  }
});
