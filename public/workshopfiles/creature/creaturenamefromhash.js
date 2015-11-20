  // thanks https://gist.github.com/jlong/2428561
  var creaturename = window.location.hash.slice(1);
  console.log(creaturename);

   $('.example').click(function () {
    $('#codeid').val(creaturename);
    $('#code').val($('script', this).html());
  });

  $(function() {
    $('#codeid').val(creaturename);
  });