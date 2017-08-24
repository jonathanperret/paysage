"use strict";

const CodeObject = require('../CodeObject');
const World = require('../World');

describe("A code object", function () {
  var playground,bob;

  beforeEach(function() {
    playground = new World().getOrCreatePlayground('any');
    bob = new CodeObject(playground,'bob','');
  });

  it("knows its id", function() {
    expect(bob.id).to.equal("bob");
  });

  it("when it is new, has empty code", function () {
    expect(bob.getData().code).to.equal('');
  });

  it("can be created with code", function() {
    var bill = new CodeObject("fakeplayground", "bill","// hello");

    expect(bill.getData().code).to.equal("// hello");
  });

  it("'s data contains its id", function() {
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

  it("notifies playground when data is set", function() {
    var spy = sinon.spy()

    playground.on('codeObjectUpdated',spy);

    bob.setData({code: '// hello'});

    expect(spy).to.have.been.calledWith(bob);
  });

});


