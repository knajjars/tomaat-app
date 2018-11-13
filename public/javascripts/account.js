window.onload = function() {
  axios.get("/account/user-preferences").then(response => {
    console.log(response.data);
  });
};
