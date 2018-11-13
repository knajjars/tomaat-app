$(document).ready(function() {


  let arr = ['a','v','c'];
  let obj = []

  axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  const cuisineObj = {};
metaDataYummly.cuisine.forEach(cuisine => {
  cuisineObj[cuisine] = null;
});

const allergyObj = {};
metaDataYummly.allergy.forEach(allergy => {
  allergyObj[allergy] = null;
});

const dietObj = {};
metaDataYummly.diet.forEach(diet => {
  dietObj[diet] = null;
});
  
  function preferredChips(arr)
  {
     for ( var counter = 0; counter < arr.length; counter++)
     {
        [obj.push( {
            tag:arr[counter]
        } )];
     }
     return obj;
  }

  preferredChips(arr)

console.log(obj)


$('.chips-cuisine').chips({
  data: obj
});

});

