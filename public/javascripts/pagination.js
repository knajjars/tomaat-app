window.onload = function() {
  const $paginationLeft = $(".pagination-left");
  const $paginationRight = $(".pagination-right");

  const URL = window.location;

  const path = "/yummly-api/decide/";
  const currentPath = window.location.pathname;
  let page = Number(currentPath.replace(path, ""));

  // go one page backward
  $paginationLeft.click(function() {
    if (page > 1) {
      const nextPagePath = path + --page + window.location.search;
      window.location = window.location.pathname = nextPagePath;
    }
  });

  // go one page forward
  $paginationRight.click(function() {
    const nextPagePath = path + ++page + window.location.search;
    window.location = window.location.pathname = nextPagePath;
  });

  if (page === 1) {
    $paginationLeft.removeClass("waves-effect");
    $paginationLeft.addClass("disabled");
  }
};
