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
  $(".carousel.carousel-slider").carousel({
    fullWidth: true,
    indicators: true
  });

  $(document).ready(function() {
    $(".collapsible").collapsible();
  });
};

const $submit = $("#submit-btn");

$submit.click(function() {
  const preferences = {
    cuisines: [],
    diets: [],
    allergies: []
  };
  const nodeBoxes = $(".box");
  const boxes = [...nodeBoxes];
  boxes.forEach(box => {
    switch (box.dataset.preference) {
      case "cuisine":
        if (box.className.match(/\active-pref\b/)) {
          preferences.cuisines.push(box.innerText);
        }
        break;
      case "diet":
        if (box.className.match(/\active-pref\b/)) {
          preferences.diets.push(box.innerText);
        }
        break;
      case "allergy":
        if (box.className.match(/\active-pref\b/)) {
          preferences.allergies.push(box.innerText);
        }
        break;
    }
  });
  axios({
    method: "PATCH",
    url: "/account/preferences",
    headers: { "X-Requested-With": "XMLHttpRequest" },
    data: {
      preferences
    }
  })
    .then(response => {
      if (response.status === 200) {
        location.reload();
      }
    })
    .catch(err => console.log(err));
});

$(document).ready(function() {
  let $ingredientsNode = $(".ingredient-cart");
  let $ingredients = [...$ingredientsNode];
  $ingredients.forEach(el => {
    el.onclick = function() {
      const recipeId = el.attributes["data-id"].nodeValue;
      const ingredient = el.innerText;
      data = {
        recipeId,
        ingredient
      };
      axios({
        method: "PATCH",
        url: "/account/shopping-cart",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        data: data
      })
        .then(response => {
          if (response.status === 200) {
            console.log("good");
          }
        })
        .catch(err => console.log(err));
    };
  });
});
