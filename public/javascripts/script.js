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
  
  // $('#cuisine .switch').toggle(function(){
  //     $('#cuisine input:checkbox').attr('checked','checked');
  //       // $(this).val('uncheck all');
  //   }
  //   )

  // $('#cuisine .switch input').is(':checked') = false

    $('#cuisine .switch input').change(function() {
        if($(this).is(":checked")) {
          $('#cuisine input:checkbox').attr('checked','checked');
        }    
        if(!$(this).is(":checked")) {
          $('#cuisine input:checkbox').attr('checked',false);
        }    
    });
    $('#allergy .switch input').change(function() {
        if($(this).is(":checked")) {
          $('#allergy input:checkbox').attr('checked','checked');
        }    
        if(!$(this).is(":checked")) {
          $('#allergy input:checkbox').attr('checked',false);
        }    
    });
    $('#diet .switch input').change(function() {
        if($(this).is(":checked")) {
          $('#diet input:checkbox').attr('checked','checked');
        }    
        if(!$(this).is(":checked")) {
          $('#diet input:checkbox').attr('checked',false);
        }    
    });



});






  $('.btn-small#allergy-btn').click(function(){
    $('#allergy input:checkbox').attr('checked','checked');
      // $(this).val('uncheck all');
  })
  $('.btn-small#diet-btn').click(function(){
    $('#diet input:checkbox').attr('checked','checked');
      // $(this).val('uncheck all');
  })
