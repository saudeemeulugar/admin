import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('mt-treasure-check-data', 'Integration | Component | mt treasure check data', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{mt-treasure-check-data}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#mt-treasure-check-data}}
      template block text
    {{/mt-treasure-check-data}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
