var io = io.connect();
var canvas = {};
var sketch = {};

// Listen for the code update event.
io.on('code update', function(data) {
    //if(sketch) {
    //  sketch.exit();
    //  sketch = null;
    //}
    
    console.log (data);
    var id = data.id;
    var code = data.code;
    console.log (id);

    canvas[id] = document.createElement('canvas');
    canvas[id].setAttribute("id", id);
    
    if (!document.getElementById(id)) {
      
      document.getElementById('container').appendChild(canvas[id]);
    }
    else {
     var oldcanvas = document.getElementById(id);
     document.getElementById('container').replaceChild(canvas[id], oldcanvas);
     console.log ("canvas replaced");
    }

    sketch[id] = new Processing(canvas[id], code);

});