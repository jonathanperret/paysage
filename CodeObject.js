"use strict";

module.exports = function() {

  function CodeObject(playground, id, initCode) {
    this._playground = playground;
    this.id = id;
    this._data = Object.create(null);
    this._data.code = initCode || '';
  }

  CodeObject.prototype.setData = function(data) {
    if (data.codeObjectId && data.codeObjectId != this.id)
      throw 'Attempt to change id';
    var that = this;
    Object.keys(data).forEach(function (key) {
      if (key != 'codeObjectId')
        that._data[key] = data[key];
    });
    this._playground.emit('codeObjectUpdated',this);
  }

  CodeObject.prototype.getData = function(data) {
    var data = { codeObjectId: this.id };
    var that = this;
    Object.keys(this._data).forEach(function(key) {
      data[key] = that._data[key];
    });
    return data;
  }

  return CodeObject;
}()
