var io = io.connect();
var canvas = {};
var sketch = {};

// the get the playground id from a data-attribute genereated by the view. Hacky.
var container = document.getElementById('container');
var playgroundid = container.getAttribute('data-playgroundid');

// emit the 'playground up' event with the playgroundid (used as a room for select broadcasting)
io.emit('playground up', playgroundid);

// Listen for the 'code update' event.
io.on('code update', function(data) {
    //if(sketch) {
    //  sketch.exit();
    //  sketch = null;
    //}
    
    console.log (data);
    var id = data.codeid;
    var code = data.code;
    console.log ('code received '+id);

    canvas[id] = document.createElement('canvas');
    canvas[id].setAttribute('id', id);
    
    if (!document.getElementById(id)) {
      
      document.getElementById('container').appendChild(canvas[id]);
      console.log ('canvas created');
    }
    else {
     var oldcanvas = document.getElementById(id);
     document.getElementById('container').replaceChild(canvas[id], oldcanvas);
     console.log ('canvas replaced');
    }

    sketch[id] = new Processing(canvas[id], code);

});

