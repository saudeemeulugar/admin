import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('treasure-check-teaser', 'Integration | Component | treasure check teaser', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{treasure-check-teaser}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#treasure-check-teaser}}
      template block text
    {{/treasure-check-teaser}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
