import Ember from 'ember';
import { computed, observer } from '@ember/object';
import { getOwner } from '@ember/application';

import ServerModelsTable from 'ember-models-table/components/models-table-server-paginated';


import layout from '../templates/components/table-history';

const set = Ember.set;

// ref https://github.com/onechiporenko/ember-models-table/blob/master/addon/components/models-table-server-paginated.js

export default ServerModelsTable.extend({
  layout,

  i18n: Ember.inject.service(),
  ajax: Ember.inject.service(),

  /**
   * @property observedProperties
   * @type string[]
   * @private
   */
  observedProperties: computed(function () {
    return [
      'currentPageNumber',
      'sortProperties.[]',
      'pageSize',
      'filterString',
      'processedColumns.@each.filterString',

      'category',
      'tag',

      'locationState',
      'city',

      'haveText',
      'haveImage',
      'haveAudio',
      'haveVideo'
    ];
  }),

  /**
   * The time to wait until new data is actually loaded.
   * This can be tweaked to avoid making too many server requests.
   *
   * @type number
   * @property debounceDataLoadTime
   * @default 500
   */
  debounceDataLoadTime: 900,
  /**
   * The property on meta to load the pages count from.
   *
   * @type {string}
   * @name metaPagesCountProperty
   */
  metaPagesCountProperty: 'count',

  /**
   * The property on meta to load the total item count from.
   *
   * @type {string}
   * @name metaItemsCountProperty
   */
  metaItemsCountProperty: 'count',

  /**
   * The pages count is get from the meta information.
   * Set metaPagesCountProperty to change from which meta property this is loaded.
   *
   * @type {number}
   * @name pagesCount
   */
  pagesCount: computed('filteredContent.meta', function () {
    let total = Ember.get(this, 'filteredContent.meta.count');
    let pageSize = Ember.get(this, 'pageSize');

    return Math.ceil(total/pageSize);
  }),

  showGlobalFilter: true,
  showColumnsDropdown: false,

  filterQueryParameters: {
    globalFilter: 'q',
    sort: 'sort',
    sortDirection: 'sortDirection',
    page: 'page',
    pageSize: 'limit'
  },

  /**
   * This is set during didReceiveAttr and whenever the page/filters change.
   *
   * @override
   * @property filteredContent
   * @default []
   * @private
   * @type object[]
   */
  filteredContent: null,

  query: observer('filteredContent.query', function() {
    this.sendAction('updateQuery', this.get('filteredContent.query', {}));
  }),

  actions: {
    searchCategoryTerms(term) {
      const ENV = getOwner(this).resolveRegistration('config:environment');

      let url = `${ENV.API_HOST}/api/v1/term-texts?term=${term}&vocabularyName=Category`;
      return this.get('ajax')
      .request(url)
      .then((json) => json.term );
    },
    searchTagsTerms(term) {
      const ENV = getOwner(this).resolveRegistration('config:environment');

      let url = `${ENV.API_HOST}/api/v1/term-texts?term=${term}&vocabularyName=Tags`;
      return this.get('ajax')
      .request(url)
      .then((json) => {
        // add current term in  terms returned from backend search:
        json.term.push(term);
        return json.term;
      });
    },
    searchLocationState(term) {
      const ENV = getOwner(this).resolveRegistration('config:environment');



      let url = `${ENV.API_HOST}/api/v1/location/BR?name=${term}`;
      return this.get('ajax')
      .request(url)
      .then( (json) => {
        if (!json || !json.lstate) {
          return {};
        }
        return json.lstate.map(function(r) {
            return { text: r.name, id: r.code };
        });
      });
    },
    searchCity(term) {
      const ENV = getOwner(this).resolveRegistration('config:environment');

      let locationState = this.get('locationState');
      if (!locationState) {
        return null;
      }

      if (locationState.id) {
        locationState = locationState.id;
      }

      let url = `${ENV.API_HOST}/api/v1/location/BR/${locationState}?name=${term}`;
      return this.get('ajax')
      .request(url)
      .then( (json) => {
        if (!json || !json.lcity) {
          return {};
        }
        return json.lcity.map(function(r) {
            return { text: r.name, id: r.id };
        });
      });
    },

    deleteRecord(record) {
      this.sendAction('deleteRecord', record);
    },
    changePublishedStatus() {
      this.sendAction('changePublishedStatus', ...arguments);
    },
    changeStatus() {
      this.sendAction('changeStatus', ...arguments);
    },
    changeDate(attrName, value) {
      if (value && value[0]) {
        let d = window.moment(value[0]).format('YYYY-MM-DD');
        this.set(attrName, d);
      } else {
        this.set(attrName, null);
      }
    }
  },

  init() {
    this._super();
    const i18n = this.get('i18n');
    this.set('themeInstance.messages', Ember.Object.create({
      "searchLabel": i18n.t("models.table.search"),
      "searchPlaceholder": "",
      "columns-title": i18n.t("models.table.columns"),
      "columns-showAll": i18n.t("models.table.show.all"),
      "columns-hideAll": i18n.t("models.table.hide.all"),
      "columns-restoreDefaults": i18n.t("models.table.restore.defaults"),
      "tableSummary": String(i18n.t("models.table.restore.table.summary")),
      // "tableSummary": "Show %@ - %@ of %@",
      "allColumnsAreHidden": i18n.t('models.table.all.columns.are.hidden'),
      "noDataToShow": i18n.t('models.table.no.records.to.show')
    }));
  },


  /**
   * Do query-request to load new data
   *
   * You may override this method to add some extra behavior or even additional requests
   *
   * @method doQuery
   * @param {object} store
   * @param {string} modelName
   * @param {object} query
   * @returns {Promise}
   */
  doQuery(store, modelName, query) {

    let category = this.get('category');
    if (category) {
      query.category = category;
    }

    let tag = this.get('tag');
    if (tag) {
      query.tags = tag;
    }

    let locationState = this.get('locationState');
    if (locationState) {
      if (locationState.id) {
        query.locationState = locationState.id;
      } else {
        query.locationState = locationState;
      }
    }

    let city = this.get('city');
    if (city) {
      if (city.text) {
        query.city = city.text;
      } else {
        query.city = city;
      }
    }

    let haveText = this.get('haveText');
    if (haveText) {
      query.haveText = true;
    }
    let haveImage = this.get('haveImage');
    if (haveImage) {
      query.haveImage = true;
    }
    let haveAudio = this.get('haveAudio');
    if (haveAudio) {
      query.haveAudio = true;
    }
    let haveVideo = this.get('haveVideo');
    if (haveVideo) {
      query.haveVideo = true;
    }

    return store.query(modelName, query).then(newData => set(this, 'filteredContent', newData));
  },

  searchOptions: null,

  category: null,
  tag: null,
  locationState: null,
  city: null,

  haveText: null,
  haveImage: null,
  haveAudio: null,
  haveVideo: null,
});