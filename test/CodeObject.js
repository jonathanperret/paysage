/* eslint-env mocha */
/* global expect,sinon */
'use strict';

const CodeObject = require('../CodeObject');

describe('A code object', function () {
  var bob, updated;

  beforeEach(function () {
    updated = sinon.spy();
    bob = new CodeObject('bob', updated);
  });

  it('knows its id', function () {
    expect(bob.id).to.equal('bob');
  });

  it("'s data contains by default its id and code", function () {
    expect(bob.getData()).to.deep.equal({
      codeObjectId: 'bob',
      code: ''
    });
  });

  it('can set and get any property', function () {
    bob.setData({ someProperty: 'value' });

    expect(bob.getData().someProperty).to.equal('value');
  });

  it('cannot change its id', function () {
    function changeBobId () {
      bob.setData({ codeObjectId: 'ga' });
    }
    expect(changeBobId).to.throw();
  });

  it('notifies when data is set', function () {
    bob.setData({ code: '// hello' });

    expect(updated).to.have.been.calledWith(bob);
  });
});
