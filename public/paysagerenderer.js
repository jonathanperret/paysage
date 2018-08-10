/* eslint no-eval: "off" */
var Paysage = window.Paysage || {};

(function () {
  'use strict';

  var canvas, layers, codes, container, playgroundId;

  Paysage.rendererInit = function () {
    canvas = Object.create(null);
    layers = Object.create(null);
    codes = Object.create(null);

    container = document.getElementById('container');
    playgroundId = container.getAttribute('data-playgroundid');

    var socket = window.io({query: {
      playgroundId: playgroundId,
      client: 'renderer'
    }}).connect();

    socket.on('code delete', function (data) {
      var id = data.codeObjectId;
      console.log('canvas deleted for ' + id);

      deleteLayer(id);
      deleteCanvas(id);
    });

    socket.on('code update', function (data) {
      var id = data.codeObjectId;
      var code = data.code;
      console.log('code received for ' + id, data);

      updateObject(id, code);
    });

    socket.on('playground full update', function (data) {
      clearLayersAndCanvas();
      data.forEach(function (codeObject) {
        updateObject(codeObject.codeObjectId, codeObject.code);
      });
    });

    installResizeHandler();

    var urlHash = "";
    setInterval(function() {
      var newHash = window.location.hash;
      if(urlHash !== newHash) {
        urlHash = newHash;
        var idList = parseUrl(urlHash);
        showOnlyLayers(idList);
      }
    }, 100);
  };

  function parseUrl(hash) {
    return hash.substring("#only=".length);
  }

  function showOnlyLayers(idList) {
    console.log("t'as demandé : " + idList);
    Object.keys(canvas).forEach(function (id) {
      if(idList && id === idList) {
        deleteLayer(id);
        console.log("afficher : " + id);
        canvas[id].style.display='';
        layers[id] = createLayer(canvas[id], codes[id], id);
      }
      else {
        console.log("cacher : " + id);
        deleteLayer(id);
        canvas[id].style.display='none';
      }
    });
  }

  function clearLayersAndCanvas () {
    Object.keys(layers).forEach(deleteLayer);
    Object.keys(canvas).forEach(deleteCanvas);
    codes = Object.create(null);
  }

  function resizeToWindow (layer) {
    layer.size(window.innerWidth, window.innerHeight);
  }

  function setDefaultBackgroundToTransparent (layer) {
    layer.background(0, 0);
  }

  function patchBackgroundFunctionToBeTransparentByDefault (layer) {
    var originalBackground = layer.background;

    // This is a replacement for the background() function
    // that defaults the alpha component to zero (fully transparent).
    function zeroAlphaDefaultBackground () {
      var args = [].slice.call(arguments);
      // If no alpha component was specified, add a zero value
      // to force a transparent background
      if (args.length === 1 || args.length === 3) {
        args.push(0);
      }
      return originalBackground.apply(this, args);
    }

    layer.background = zeroAlphaDefaultBackground;
  }

  function wrapDrawToCatchExceptions (layer, id) {
    var realDraw = layer.draw;
    layer.draw = function () {
      try {
        realDraw.call(this);
      } catch (e) {
        console.error('Error in code object "' + id + '". Rendering stopped.', e);
        this.exit();
      }
    };
  }

  function createCanvas (id) {
    if (!canvas[id]) {
      canvas[id] = document.createElement('canvas');
      // to delete this line before merging to master
      canvas[id].setAttribute('id', id);
      container.appendChild(canvas[id]);
      console.log('canvas created for ' + id);
    } else {
      console.log('canvas reused for ' + id);
    }
  }

  function deleteCanvas (id) {
    canvas[id].parentNode.removeChild(canvas[id]);
    delete canvas[id];
  }

  function deleteLayer (id) {
    if (layers[id]) {
      try {
        layers[id].exit();
      } catch (e) { }
      delete layers[id];
    }
  }

  function updateObject (id, code) {
    try {
      deleteLayer(id);
      createCanvas(id);
      layers[id] = createLayer(canvas[id], code, id);
      codes[id] = code;
    } catch (e) {
      console.error('Error in code object "' + id + '". Code not rendered.', e);
    }
  }

  function evaluateCompiledCode (sketch, id) {
    // The sourceURL annotation is necessary to get a proper stack trace
    // inside the eval'd code
    sketch.sourceCode += '//# sourceURL=' + encodeURIComponent(id) + '-compiled.js';

    // And we have to bypass the bit of code in Processing.js that uses
    // a Function constructor instead of eval() for this to work
    sketch.attachFunction = eval(sketch.sourceCode);
  }

  function createLayer (targetCanvas, code, id) {
    // The compilation step is split from the creation of the Processing object
    // so that we can hook the onLoad event to set width, height, and background
    // correctly before setup() runs.
    var sketch = window.Processing.compile(code);

    evaluateCompiledCode(sketch, id);

    sketch.onLoad = function (layer) {
      wrapDrawToCatchExceptions(layer, id);
      setDefaultBackgroundToTransparent(layer);
      patchBackgroundFunctionToBeTransparentByDefault(layer);
      resizeToWindow(layer);
    };

    return new window.Processing(targetCanvas, sketch);
  }

  function installResizeHandler () {
    var resizeTimeout;

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        Object.keys(layers).forEach(function (id) {
          resizeToWindow(layers[id]);
        });
      }, 1000);
    });
  }
})();
