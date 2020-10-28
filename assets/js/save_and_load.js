// This is the key that we save the list (set) of titles to. It is not a valid title.
var TITLE_SAVE_KEY = "titles"; // TODO: Change?
// Version will be stored when a recipe is saved so we can run migrations if anything
// changes in the data structure.
var VERSION = 1.0;

var brewing_proto = protobuf.load("assets/brewing.proto");

var getRecipeProto = async function () {
  var root = await brewing_proto;
  return root.lookupType("Recipe");
};

var getTitles = function () {
  return new Set(JSON.parse(window.localStorage.getItem(TITLE_SAVE_KEY)));
};

var saveTitles = function (titles) {
  window.localStorage.setItem(
    TITLE_SAVE_KEY,
    JSON.stringify(Array.from(titles))
  );
};

var encodeRecipe = async function (data) {
  var recipe = await getRecipeProto();
  data.version = VERSION;
  // TODO: validate data!
  var str_bytes = String.fromCharCode.apply(null, recipe.encode(data).finish());
  return btoa(str_bytes);
};

var decodeRecipe = async function (encoded_data) {
  var recipe = await getRecipeProto();
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
  var titles = getTitles();

  if (titles.has(title)) {
    var confirmation = confirm(
      "This will override your previous save, do you want to continue?"
    );
    if (!confirmation) {
      return;
    }
  }
  encoded_data = await encodeRecipe(data);
  window.localStorage.setItem(title, encoded_data);

  titles.add(title);
  saveTitles(titles);
};

var populateModal = function () {
  var titles = getTitles();
  var recipeList = $("#loadRecipeList");
  recipeList.empty();
  for (let title of titles) {
    recipeList.append(
      `<li>\
        <a onClick=\"load('${title}')\">${title}</a> \
        (<a class="text-danger" onClick=\"deleteSaved('${title}')\">delete</a>)\
      </li>`
    );
  }
};

var selectSaved = function () {
  populateModal();
  $("#loadModal").modal("show");
};

var deleteSaved = function (title) {
  var confirmation = confirm(
    "This will delete this recipe, and cannot be undone. Do you want to continue?"
  );
  if (!confirmation) {
    return;
  }
  titles = getTitles();
  titles.delete(title);
  saveTitles(titles);
  window.localStorage.removeItem(title);
  populateModal();
};

var load = async function (title) {
  $("#loadModal").modal("hide");
  var encoded_data = window.localStorage.getItem(title);
  data = await decodeRecipe(encoded_data);
  $("#recipeForm").alpaca("destroy");
  console.log(data);
  initialise(data);
};

var getLink = async function (data) {
  encoded_data = await encodeRecipe(data);
  console.log(window.location.href + "?data=" + encoded_data);
};

var brew = async function (data) {
  encoded_data = await encodeRecipe(data);
  window.location.href = "/log?data=" + encoded_data;
};
