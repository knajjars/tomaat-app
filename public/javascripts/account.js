window.onload = function() {
  axios.get("/account/user-preferences").then(response => {
    console.log(response.data);
  });

  $(".tabs").tabs({ swipeable: true });
  $(".carousel").append(`
  <div class="carousel-fixed-item center">
  <a class="btn waves-effect white grey-text darken-text-2 button-save">
  <i class="material-icons">cloud_done</i>
  Save</a>
</div>
  `);
  $(".carousel.carousel-slider").carousel({
    fullWidth: true,
    indicators: true
  });

  $(document).ready(function() {
    $(".collapsible").collapsible();
  });
};
