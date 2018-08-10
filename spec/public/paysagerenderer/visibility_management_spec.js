/* global describe, beforeEach, it, expect */
/* global Paysage */
describe('The Paysage renderer visibility management', function () {
  it('can parse Url hash for code objects ids to display', function () {
    expect(Paysage.readIdsFromUrlHash('')).toEqual(undefined);
    expect(Paysage.readIdsFromUrlHash('#')).toEqual(undefined);
    expect(Paysage.readIdsFromUrlHash('#toto')).toEqual(['toto']);
    expect(Paysage.readIdsFromUrlHash('#toto,titi')).toEqual(['toto', 'titi']);
  });

  describe('has code object filtering', function () {
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

    it('that show all code objects when no id is given', function () {
      Paysage.showCodeObjects(['toto', 'titi'], undefined, show, hide);

      expect(shownIds).toEqual(['toto', 'titi']);
      expect(hiddenIds).toEqual([]);
    });

    it('that show only requeted code objects', function () {
      Paysage.showCodeObjects(['toto', 'titi'], ['toto'], show, hide);

      expect(shownIds).toEqual(['toto']);
      expect(hiddenIds).toEqual(['titi']);
    });
  });
});
