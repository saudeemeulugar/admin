import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    deleteRecord(record) {
      if (confirm(`Tem certeza que deseja deletar a história "${record.get('title')}"? \nEssa ação não pode ser desfeita.`)) {
        record.destroyRecord()
        .then( ()=> {
          this.get('notifications').success(`A história "${record.get('title')}" foi deletada.`);
          this.transitionTo('history.index');
          return null;
        });
      }
    },
    changePublishedStatus(record, status) {
      Ember.set(record, 'published', status);
      if (status) {
        Ember.set(record, 'publishedAt', new Date());
      } else {
        Ember.set(record, 'publishedAt', null);
      }

      record.save()
      .then( (r)=> {
        if (status) {
          this.get('notifications').success('História publicada.');
        } else {
          this.get('notifications').success('História despublicada.');
        }
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
      });
    },
    save(record, alias) {
      record.save()
      .then( function saveAlias(content) {
        return alias.save()
        .then( ()=> {
          return content;
        });
      })
      .then( (r)=> {
        this.get('notifications').success('Dados salvos.');
        // move scroll to top:
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // success
        return r;
      })
      .catch( (err)=> {
        this.send('queryError', err);
        return err;
      });
    }
  }
});
