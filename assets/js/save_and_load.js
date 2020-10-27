// This is the key that we save the list (set) of titles to. It is not a valid title.
var TITLE_SAVE_KEY = "titles"; // TODO: Change?
// Version will be stored when a recipe is saved so we can run migrations if anything
// changes in the data structure.
var VERSION = 1.0;

var get_titles = function () {
  return new Set(JSON.parse(window.localStorage.getItem(TITLE_SAVE_KEY)));
};

var save_titles = function (titles) {
  window.localStorage.setItem(
    TITLE_SAVE_KEY,
    JSON.stringify(Array.from(titles))
  );
};

var encode_data = function (data) {
  data.version = VERSION;
  var encoded_data = btoa(JSON.stringify(data));
  return encoded_data;
};

var decode_data = function (encoded_data) {
  var data = JSON.parse(atob(encoded_data));
  if (data.version != VERSION) {
    // Add migration logic here if version changes.
    alert("Something went wrong recovering the save.");
    return;
  }
  return data;
};

var save = function (data) {
  var title = data.title;
  var titles = get_titles();

  if (titles.has(title)) {
    var confirmation = confirm(
      "This will override your previous save, do you want to continue?"
    );
    if (!confirmation) {
      return;
    }
  }
  encoded_data = encode_data(data);
  window.localStorage.setItem(title, encoded_data);

  titles.add(title);
  save_titles(titles);
};

var populate_modal = function () {
  var titles = get_titles();
  var recipeList = $("#loadRecipeList");
  recipeList.empty();
  for (let title of titles) {
    recipeList.append(
      `<li>\
        <a onClick=\"load('${title}')\">${title}</a> \
        (<a class="text-danger" onClick=\"delete_saved('${title}')\">delete</a>)\
      </li>`
    );
  }
};

var select_saved = function () {
  populate_modal();
  $("#loadModal").modal("show");
};

var delete_saved = function (title) {
  var confirmation = confirm(
    "This will delete this recipe, and cannot be undone. Do you want to continue?"
  );
  if (!confirmation) {
    return;
  }
  titles = get_titles();
  titles.delete(title);
  save_titles(titles);
  window.localStorage.removeItem(title);
  populate_modal();
};

var load = function (title) {
  $("#loadModal").modal("hide");
  var encoded_data = window.localStorage.getItem(title);
  data = decode_data(encoded_data);
  $("#recipeForm").alpaca("destroy");
  initialise(data);
};

var get_link = function (data) {
  console.log(window.location.href + "?data=" + encode_data(data));
};

var brew = function (data) {
  window.location.href = "/log?data=" + encode_data(data);
};
