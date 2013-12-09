/**
 * @fileoverview Library for rendering cards.
 * Depends on http://beebole.com/pure js library.
 */


/**
 * Namespace.
 */
var cards = {};


/**
 * Used by pure.js to populate the template.
 * @type {Object.<string>}
 * @const
 */
cards.MAPPING_DIRECTIVE = {
  '.action': 'actionText',
  '.action@href': 'actionUrl',
  '.description': 'description',
  '.image@src': 'image',
  '.notableFor': 'notableFor',
  '.name': 'name',
  '.namedAfter a': 'namedAfterText',
  '.namedAfter a@href': 'namedAfterUrl',
  '.namedAfter@display': 'namedAfterDisplay',
  '.films@display' : 'filmsDisplay',
  'a.film': {
    'film<-films': {
     '.': 'film.text',
     '@href': 'film.url'
    }
  }
};


/**
 * Compiled purejs template for a card.
 * @type {Function}
 * @const
 */
cards.CARD_TEMPLATE = $('div.card').compile(cards.MAPPING_DIRECTIVE);


/**
 * Checks whether the card is currently displayed in the UI.
 * @param {string} mid Freebase topic id for a card.
 * @return {boolean} True if card is currently displayed.
 */
cards.isCardDisplayed = function(mid) {
  return !!$('.card[data-mid="' + mid + '"]').length;
};


/**
 * Displays a card.
 * @param {Object} entity Freebase topic/entity.
 */
cards.displayCard = function(entity) {
  $('.card').show();
  $('.card').attr('data-mid', entity.id);
  var cardContent = {
    'name': entity.property['/type/object/name'].values[0].value,
    'description': entity.property['/common/topic/description'].values[0].text,
    'notableFor': '',
    'image': 'images/none.gif',
    'actionUrl': '',
    'actionText': '',
    'films': [{'text': '', url: ''}],
    'filmsDisplay': 'false'
  };
  if (entity.property['/common/topic/notable_for']) {
    cardContent['notableFor'] = entity.property['/common/topic/notable_for']
        .values[0].text;
  }
  if (entity.property['/common/topic/image']) {
    cardContent['image'] = 'https://www.googleapis.com/freebase/v1/image/' +
        entity.property['/common/topic/image'].values[0].id + '?maxwidth=260';
  }
  if (entity.property['/common/topic/official_website']) {
    cardContent['actionUrl'] = entity.property['/common/topic/official_website']
        .values[0].value;
    cardContent['actionText'] = 'Visit official website';
  }
  if (fbmap.category == '/symbols/namesake' &&
      entity.property['/symbols/namesake/named_after']) {
    cardContent['namedAfterText'] = entity
        .property['/symbols/namesake/named_after'].values[0].text;
    cardContent['namedAfterUrl'] = 'http://freebase.com' +
        entity.property['/symbols/namesake/named_after'].values[0].id;
    cardContent['namedAfterDisplay'] = true;
  }
  if (fbmap.category == '/film/film_location' &&
      entity.property['/film/film_subject/films']) {
    cardContent['films'] = [];
    for (var i = 0, film;
         film = entity.property['/film/film_subject/films'].values[i]; i++) {
      cardContent['films'].push({
        'text': film.text,
        'url': 'http://freebase.com' + film.id
      });
    }
    cardContent['filmsDisplay'] = true;
  }
  $('div.card').render(cardContent, cards.CARD_TEMPLATE);
};
