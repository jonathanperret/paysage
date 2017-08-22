"use strict";

module.exports = function() {

  function CodeObject(playground,id,initCode) {
    this.playground = playground;
    this.id = id;
    this._code = initCode ? initCode : '';
  }

  CodeObject.prototype.code = function() { 
    return this._code;
  }

  CodeObject.prototype.setCode = function(newCode) {
    this._code = newCode;
    this.playground.emit('codeObjectUpdated',this);
  }

  CodeObject.prototype.setCodeSilently = function(newCode) {
    this._code = newCode;
  }

  return CodeObject;
}()
