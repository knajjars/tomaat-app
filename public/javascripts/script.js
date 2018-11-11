document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});

// Or with jQuery

$(document).ready(function() {
  $(".sidenav").sidenav();
});

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems);
});

// Or with jQuery

$(document).ready(function() {
  $(".collapsible").collapsible();
});



  $('.btn-small:button').click(function(){
    $('#cuisine input:checkbox').attr('checked','checked');
      // $(this).val('uncheck all');
  }
  // ,function(){
  //     $('input:checkbox').removeAttr('checked');
  //     $(this).val('check all');        
  // }
  )
