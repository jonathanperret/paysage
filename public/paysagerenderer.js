var Paysage = window.Paysage || {};

(function () {
  'use strict';

  var container, playgroundId;
  var iframes = {};

  Paysage.rendererInit = function () {
    container = document.getElementById('container');
    playgroundId = container.getAttribute('data-playgroundid');

    var socket = window.io({
      query: {
        playgroundId: playgroundId,
        client: 'renderer'
      }
    }).connect();

    socket.on('code delete', function (data) {
      var id = data.codeObjectId;
      console.log('iframe deleted for ' + id);
      deleteIframe(id);
    });

    socket.on('code update', function (data) {
      var id = data.codeObjectId;
      var code = data.code;
      console.log('code received for ' + id, data);
      updateObject(id, code);
    });

    socket.on('playground full update', function (data) {
      clearIframes();
      data.forEach(function (codeObject) {
        updateObject(codeObject.codeObjectId, codeObject.code);
      });
    });

    installResizeHandler();
  };

  function clearIframes() {
    Object.keys(iframes).forEach(deleteIframe);
  }

  function createIframe(id) {
    var iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.src = 'about:blank';
    container.appendChild(iframe);
    iframes[id] = iframe;
    return iframe;
  }

  function deleteIframe(id) {
    if (iframes[id]) {
      iframes[id].parentNode.removeChild(iframes[id]);
      delete iframes[id];
    }
  }

  function updateObject(id, code) {
    var iframe = iframes[id] || createIframe(id);
    var iframeContent = generateIframeContent(id, code);
    iframe.srcdoc = iframeContent;
  }

  function generateIframeContent(id, code) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; }
          canvas { display: block;}
        </style>
      </head>
      <body>
        <script>
          ${code}
                                  
          // Listen for resize events
          window.addEventListener('resize', resizeAllCanvas);

          function resizeAllCanvas() {
            // Get the device pixel ratio
            const pixelRatio = window.devicePixelRatio || 1;

            // Select all canvas elements on the page
            const canvases = document.querySelectorAll('canvas');

            console.log("Resizing canvas", canvases);

            canvases.forEach(canvas => {
              const container = canvas.parentElement;
              if (container) {
                // Get the document's width and height
                const documentWidth = document.documentElement.clientWidth;
                const documentHeight = document.documentElement.clientHeight;

                // Set the canvas width and height according to pixel ratio
                canvas.width = documentWidth * pixelRatio;
                canvas.height = documentHeight * pixelRatio;

                // Set the canvas style dimensions to match container's CSS size
                canvas.style.width = documentWidth + "px";
                canvas.style.height = documentHeight + "px";

                // If necessary, you can set the canvas context's scaling
                const context = canvas.getContext('2d');
                if (context) {
                  context.scale(pixelRatio, pixelRatio);
                }
              }
            });
          }          
        </script>
      </body>
      </html>
    `;
  }

  function resizeToWindow(iframe) {

    if (iframe) {
      iframe.style.width = window.innerWidth + "px";
      iframe.style.height = window.innerHeight + "px";
    }
  }

  function installResizeHandler() {
    var resizeTimeout;

    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        Object.keys(iframes).forEach(function (id) {
          var iframe = iframes[id];
          resizeToWindow(iframe);
        });
      }, 250);
    });
  }
})();