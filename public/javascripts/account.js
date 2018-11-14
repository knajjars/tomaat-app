window.onload = function() {
  axios.get("/account/user-preferences").then(response => {
    const data = response.data;
    const nodeBoxes = $(".box");
    const boxes = [...nodeBoxes];
    boxes.forEach(box => {
      switch (box.dataset.preference) {
        case "cuisine":
          if (data.cuisines.includes(box.innerText)) {
            box.classList.add("active-pref");
          }
          break;
        case "diet":
          if (data.diets.includes(box.innerText)) {
            box.classList.add("active-pref");
          }
          break;
        case "allergy":
          if (data.allergies.includes(box.innerText)) {
            box.classList.add("active-pref");
          }
          break;
      }
    });
  });

  const $box = $(".box");
  $box.click(function() {
    if ($(this).hasClass("active-pref")) {
      $(this).removeClass("active-pref");
    } else {
      $(this).addClass("active-pref");
    }
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
