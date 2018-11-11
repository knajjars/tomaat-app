$(".chips").chips();
const cuisineObj = {};
const cuisinesString =
  "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese";
cuisinesString.split(",").forEach(cuisine => {
  cuisineObj[cuisine.trim()] = null;
});

$(".chips-autocomplete").chips({
  autocompleteOptions: {
    data: cuisineObj,
    limit: Infinity,
    minLength: 1
  }
});

$("#preferences-submit-btn").click(e => {
  const preferedCuisines = $(".chips")
    .text()
    .split("close");
  preferedCuisines.pop();
  console.log(preferedCuisines);
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
