/* global describe, beforeEach, it, expect */
/* global Paysage */
describe('The Paysage renderer visibility management', function () {
  it('can parse Url hash for code objects ids to display', function () {
    Paysage.readIdsFromUrlHash('');
    expect(Paysage.idsToShow).toEqual(undefined);

    Paysage.readIdsFromUrlHash('#');
    expect(Paysage.idsToShow).toEqual(undefined);

    Paysage.readIdsFromUrlHash('#only=toto');
    expect(Paysage.idsToShow).toEqual(['toto']);

    Paysage.readIdsFromUrlHash('#only=toto,titi');
    expect(Paysage.idsToShow).toEqual(['toto', 'titi']);

    Paysage.readIdsFromUrlHash('#only=');
    expect(Paysage.idsToShow).toEqual([]);
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
      Paysage.idsToShow = undefined;
      Paysage.filterCodeObjects(['toto', 'titi'], show, hide);

      expect(shownIds).toEqual(['toto', 'titi']);
      expect(hiddenIds).toEqual([]);
    });

    it('that show only requeted code objects', function () {
      Paysage.idsToShow = ['toto'];
      Paysage.filterCodeObjects(['toto', 'titi'], show, hide);

      expect(shownIds).toEqual(['toto']);
      expect(hiddenIds).toEqual(['titi']);
    });
  });
});
