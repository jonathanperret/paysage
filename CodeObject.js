"use strict";

function CodeObject(id, updated) {
  this._updated = updated || function(){};
  this.id = id;
  this._data = Object.create(null);
  this._data.code = '';
}

CodeObject.prototype.setData = function(data) {
  if (data.codeObjectId && data.codeObjectId != this.id)
    throw 'Attempt to change id';
  var that = this;
  Object.keys(data).forEach(function (key) {
    if (key != 'codeObjectId')
      that._data[key] = data[key];
  });
  this._updated(this);
}

CodeObject.prototype.getData = function(data) {
  var data = { codeObjectId: this.id };
  var that = this;
  Object.keys(this._data).forEach(function(key) {
    data[key] = that._data[key];
  });
  return data;
}

module.exports = CodeObject;
