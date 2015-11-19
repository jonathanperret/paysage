$('.example').click(function () {
    $('#codeid').val(chance.word());
    $('#code').val($('script', this).html());
  });

  $(function() { $('#codeid').val(chance.word()); });