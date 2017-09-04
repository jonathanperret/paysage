"use strict";

const CodeObject = require('../CodeObject');
const World = require('../World');

describe("A code object", function () {
  var bob, updated;

  beforeEach(function() {
    updated = sinon.spy();
    bob = new CodeObject('bob', updated);
  });

  it("knows its id", function() {
    expect(bob.id).to.equal("bob");
  });

  it("'s data contains its id and code", function() {
    expect(bob.getData()).to.deep.equal({
      codeObjectId: 'bob',
      code: ''
    })
  });

  it("can set and get its data", function() {
    bob.setData({ someProperty: 'value' });

    expect(bob.getData()).to.deep.equal({
      codeObjectId: 'bob',
      someProperty: 'value',
      code: ''
    });
  });

  it("cannot change its id", function() {
    function changeBobId() {
      bob.setData({codeObjectId: 'ga'});
    };
    expect(changeBobId).to.throw();
  });

  it("notifies when data is set", function() {
    bob.setData({code: '// hello'});

    expect(updated).to.have.been.calledWith(bob);
  });

});


