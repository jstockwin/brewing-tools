var save = function (data, version) {
  data.version = version;
  var title = data.title;
  if (title in window.localStorage) {
    var confirmation = confirm(
      "This will override your previous save, do you want to continue?"
    );
    if (!confirmation) {
      return;
    }
  }
  var encoded_data = btoa(JSON.stringify(data));
  window.localStorage.setItem(title, encoded_data);
};

var load = function (current_version) {
  // TODO: Add proper popup to select existing saves.
  var title = prompt("Enter your recipe title:");
  var encoded_data = window.localStorage.getItem(title);
  var data = JSON.parse(atob(encoded_data));
  if (data.version != current_version) {
    // Add migration logic here if version changes.
    alert("Something went wrong recovering the save.");
    return;
  }
  $("#form").alpaca("destroy");
  initialise(data);
};
