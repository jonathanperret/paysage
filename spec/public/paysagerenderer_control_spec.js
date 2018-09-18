/* global describe, beforeEach, it, expect */
/* global Paysage */
describe('The Paysage renderer controls', function () {
  it('parse Url hash for code objects ids to display', function () {
    expect(Paysage.readIdsFromUrlHash('')).toEqual(undefined);
    expect(Paysage.readIdsFromUrlHash('#')).toEqual(undefined);
    expect(Paysage.readIdsFromUrlHash('#toto')).toEqual(['toto']);
    expect(Paysage.readIdsFromUrlHash('#toto,titi')).toEqual(['toto', 'titi']);
  });

  describe('layer filtering', function () {
    var shownIds;
    var hiddenIds;

    var show = function (id) {
      shownIds.push(id);
    };

    var hide = function (id) {
      hiddenIds.push(id);
    };

    beforeEach(function () {
      shownIds = [];
      hiddenIds = [];
    });

    it('show requeted code objects', function () {
      Paysage.showCodeObjects(['toto', 'titi'], ['toto'], show, hide);

      expect(shownIds).toEqual(['toto']);
      expect(hiddenIds).toEqual(['titi']);
    });

    it('show all code objects if none is requested', function () {
      Paysage.showCodeObjects(['toto', 'titi'], undefined, show, hide);

      expect(shownIds).toEqual(['toto', 'titi']);
      expect(hiddenIds).toEqual([]);
    });
  });
});
