getCompleteSource = function() {

var sourcecode = "";

 $.get(

    "/workshopfiles/creature/creatureclass.pde",

    function(originalsource) {

      var template = originalsource;
      var usercode = document.getElementById('code').value;

      var match = /\/\/kids code here/;

      sourcecode = template.replace(match, usercode);
      console.log(sourcecode);
    },

    "text");

 console.log(sourcecode);

 return sourcecode;

};