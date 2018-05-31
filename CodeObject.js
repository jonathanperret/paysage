'use strict';

function CodeObject (id, updated) {
  this._updated = updated || function () {};
  this.id = id;
  this._data = Object.create(null);
  this._data.name = id;
  this._data.code = '';
}

CodeObject.prototype.setName = function (newName) {
  this._data.name = newName;
};

CodeObject.prototype.getName = function () {
  return this._data.name;
};

CodeObject.prototype.getId = function () {
  return this.id;
};

CodeObject.prototype.setData = function (data) {
  if (data.codeObjectId && data.codeObjectId !== this.id) {
    throw new Error('Attempt to change id');
  }
  var that = this;
  Object.keys(data).forEach(function (key) {
    if (key !== 'codeObjectId') { that._data[key] = data[key]; }
  });
  this._updated(this);
};

CodeObject.prototype.getData = function (propertyName) {
  var data = { codeObjectId: this.id };
  for (var key of Object.keys(this._data)) {
    if (!propertyName || propertyName === key) {
      data[key] = this._data[key];
    }
  }
  return data;
};

module.exports = CodeObject;
