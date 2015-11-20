getCompleteSource = function(callback) {

var sourcecode = "";

 $.get(

    "/workshopfiles/creature/creature.pde",

    function(originalsource) {

      var template = originalsource;
      var usercode = document.getElementById('code').value;

      var match = /\/\/kids code here/;

      sourcecode = template.replace(match, usercode);
      callback(sourcecode);

    },

    "text");

};
