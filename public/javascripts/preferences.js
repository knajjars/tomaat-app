$(".chips").chips();
const cuisineObj = {};
const cuisinesString =
  "American, Italian, Asian, Mexican, Southern & Soul Food, French, Southwestern, Barbecue, Indian, Chinese, Cajun & Creole, English, Mediterranean, Greek, Spanish, German, Thai, Moroccan, Irish, Japanese, Cuban, Hawaiin, Swedish, Hungarian, Portugese";
cuisinesString.split(",").forEach(cuisine => {
  cuisineObj[cuisine] = null;
});

$(".chips-autocomplete").chips({
  autocompleteOptions: {
    data: cuisineObj,
    limit: Infinity,
    minLength: 1
  }
});

$(".chips").change(e => {
  console.log("chip added!");
  const elems = document.querySelectorAll(".chips");
  const instances = M.Chips.init(elems, options);
});
