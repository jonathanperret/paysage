//thanks http://stackoverflow.com/a/8586564 … and jQuery :-)

var getScript = function (src, callback) {
  var s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.onreadystatechange = s.onload = function() {
    if (!callback.done && (!s.readyState || /loaded|complete/.test(s.readyState))) {
      callback.done = true;
      callback();
    }
  };
  document.querySelector('head').appendChild(s);
};

background(); // to please Processing.js and the Paysage Renderer

var drawd3 = function () {

      var data = [10,54, 14, 12];

      var svg = d3
      .select("body")
      .append("svg")
      .attr("width", 600)
      .attr("height", 500);

      var nodes = svg
      .selectAll(".node")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", function(monchiffre) {return monchiffre*2;})
      .style("fill", "grey")
      .attr("cy", function(monchiffre, sonemplacementdansletableau) {return 100+sonemplacementdansletableau*100;})
      .attr("cx", function(monchiffre, sonemplacementdansletableau) {return 100+sonemplacementdansletableau*100;});


};

getScript("https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js", drawd3);