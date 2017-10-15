/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */
/* global expect */
'use strict';

var World = require('../World');

describe('World', function () {
  var world;

  beforeEach(function () {
    world = new World();
  });

  it('creates playgrounds on demand', function () {
    var playground = world.getOrCreatePlayground('Miami beach');
    expect(playground.id).to.equal('Miami beach');
  });

  it('lists all the playgrounds ids', function () {
    world.getOrCreatePlayground('Miami beach');
    expect(world.tour()).to.deep.equal(['Miami beach']);
  });

  it('can tell when it does not contain a playground, based on its id', function () {
    expect(world.contains('Miami beach')).to.be.false;
  });

  it('can tell when it contains a playground, based on its id', function () {
    world.getOrCreatePlayground('Miami beach');
    expect(world.contains('Miami beach')).to.be.true;
  });

  it('can forget about an empty playground once all references are gone', function () {
    const playground = world.getOrCreatePlayground('Miami beach');
    const playgroundOtherReference = world.getOrCreatePlayground('Miami beach');

    world.releasePlayground(playground);
    expect(world.contains('Miami beach')).to.be.true;

    world.releasePlayground(playgroundOtherReference);
    expect(world.contains('Miami beach')).to.be.false;
  });

  it('can remember an non-empty playground even when no references exist', function () {
    const playground = world.getOrCreatePlayground('Miami beach');
    playground.getOrCreateCodeObject('obj');

    world.releasePlayground(playground);
    expect(world.contains('Miami beach')).to.be.true;
  });
});
