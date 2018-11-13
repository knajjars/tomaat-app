// $(document).ready(function() {

//   let obj = []
//   let arr = $('p').text().split(',')
  
//   function preferredChips(arr)
//   {
//      for ( var counter = 1; counter <= arr.length; counter++)
//      {
//         [obj.push( {
//             tag:arr[counter]
//         } )];
//      }
//      return obj;
//   }
  
  

//   preferredChips(arr)

//   $('.chips-cuisine').chips({
//     data: obj,
//   });



//   $(".chips").chips();
// const cuisineObj = {};
// metaDataYummly.cuisine.forEach(cuisine => {
//   cuisineObj[cuisine] = null;
// });

// const allergyObj = {};
// metaDataYummly.allergy.forEach(allergy => {
//   allergyObj[allergy] = null;
// });

// const dietObj = {};
// metaDataYummly.diet.forEach(diet => {
//   dietObj[diet] = null;
// });

// $(".chips-cuisine").chips({
//   autocompleteOptions: {
//     data: cuisineObj,
//     limit: Infinity,
//     minLength: 1
//   }
// });

// $(".chips-allergy").chips({
//   autocompleteOptions: {
//     data: allergyObj,
//     limit: Infinity,
//     minLength: 1
//   }
// });

// $(".chips-diet").chips({
//   autocompleteOptions: {
//     data: dietObj,
//     limit: Infinity,
//     minLength: 1
//   }
// });



// $("#account-preferences-submit-btn").click(e => {
//   const cuisines = $(".chips-cuisine")
//     .text()
//     .split("close");
//   cuisines.pop();

//   const allergies = $(".chips-allergy")
//     .text()
//     .split("close");
//   allergies.pop();
//   const diets = $(".chips-diet")
//     .text()
//     .split("close");
//   diets.pop();

//   axios({
//     method: "PATCH",
//     url: "http://localhost:3000/auth/accountPreferences",
//     headers: { "X-Requested-With": "XMLHttpRequest" },
//     data: {
//       preferences: {
//         cuisines,
//         diets,
//         allergies
//       }
//     }
//   })
//     .then(() => {
//       window.location = window.location.origin;      
//     })
//     .catch(err => console.log(err));
// });

// $(document).ready(function() {
//   $(".tabs").tabs({ swipeable: true });
// });


// });

