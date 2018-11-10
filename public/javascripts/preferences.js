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
