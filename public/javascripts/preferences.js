$(".chips").chips();
const cuisineObj = {};
const cuisinesString =
  "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese";
cuisinesString.split(",").forEach(cuisine => {
  cuisineObj[cuisine.trim()] = null;
});

const allergyObj = {};
const allergyString =
  "Dairy, Egg, Gluten, Peanut, Seafood, Sesame, Soy, Sulfite, Tree Nut, Wheat";
allergyString.split(",").forEach(allergy => {
  allergyObj[allergy.trim()] = null;
});

const dietObj = {};
const dietString =
  "Lacto vegetarian, Ovo vegetarian, Pescetarian, Vegan, Vegetarian";
dietString.split(",").forEach(diet => {
  dietObj[diet.trim()] = null;
});

$(".chips-cuisine").chips({
  autocompleteOptions: {
    data: cuisineObj,
    limit: Infinity,
    minLength: 1
  }
});

$(".chips-allergy").chips({
  autocompleteOptions: {
    data: allergyObj,
    limit: Infinity,
    minLength: 1
  }
});

$(".chips-diet").chips({
  autocompleteOptions: {
    data: dietObj,
    limit: Infinity,
    minLength: 1
  }
});

$("#preferences-submit-btn").click(e => {
  const preferedCuisines = $(".chips")
    .text()
    .split("close");
  preferedCuisines.pop();
  axios({
    method: "POST",
    url: "http://localhost:3000/auth/preferences",
    headers: { "X-Requested-With": "XMLHttpRequest" },
    data: {
      preferedCuisines: preferedCuisines
    }
  })
    .then(() => (window.location = window.location.origin))
    .catch(err => console.log(err));
});

$(document).ready(function() {
  $(".tabs").tabs({ swipeable: true });
});
