// This is the key that we save the list (set) of titles to. It is not a valid title.
var TITLE_SAVE_KEY = "titles"; // TODO: Change?
// Version will be stored when a recipe is saved so we can run migrations if anything
// changes in the data structure.
var VERSION = 1.0;

var brewing_proto = protobuf.load("assets/brewing.proto");

var get_recipe_proto = async function () {
  var root = await brewing_proto;
  return root.lookupType("Recipe");
};

var get_titles = function () {
  return new Set(JSON.parse(window.localStorage.getItem(TITLE_SAVE_KEY)));
};

var save_titles = function (titles) {
  window.localStorage.setItem(
    TITLE_SAVE_KEY,
    JSON.stringify(Array.from(titles))
  );
};

var encode_recipe = async function (data) {
  var recipe = await get_recipe_proto();
  data.version = VERSION;
  // TODO: validate data!
  var str_bytes = String.fromCharCode.apply(null, recipe.encode(data).finish());
  return btoa(str_bytes);
};

var decode_recipe = async function (encoded_data) {
  var recipe = await get_recipe_proto();
  decoded_payload = atob(encoded_data);
  var buffer = new Uint8Array(decoded_payload.length);
  for (var i = 0; i < decoded_payload.length; i++) {
    buffer[i] = decoded_payload.charCodeAt(i);
  }
  // TODO: Handle different versions?
  return recipe.decode(buffer);
};

var save = async function (data) {
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
  encoded_data = await encode_recipe(data);
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

var load = async function (title) {
  $("#loadModal").modal("hide");
  var encoded_data = window.localStorage.getItem(title);
  data = await decode_recipe(encoded_data);
  $("#recipeForm").alpaca("destroy");
  console.log(data);
  initialise(data);
};

var get_link = async function (data) {
  encoded_data = await encode_recipe(data);
  console.log(window.location.href + "?data=" + encoded_data);
};

var brew = async function (data) {
  encoded_data = await encode_recipe(data);
  window.location.href = "/log?data=" + encoded_data;
};
