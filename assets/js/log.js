var get_initial_data = function (data) {
  var additions = data.hops.map((hop) => {
    return {
      description: hop.name + " (" + hop.quantity + "g)",
      addition_time: data.total_boil_time - hop.boil_time,
    };
  });
  return {
    recipe_title: data.title,
    additions: additions,
  };
};

var initialise_log = function (data) {
  initial_data = get_initial_data(data);

  $("#logForm").alpaca({
    schema: {
      type: "object",
      title: "Brewing Log",
      properties: {
        recipe_title: {
          type: "string",
          title: "Recipe Title",
          readonly: true,
        },
        additions: {
          type: "array",
          title: "Additions",
          items: {
            type: "object",
            properties: {
              description: {
                title: "Description",
                type: "string",
                readonly: true,
              },
              addition_time: {
                title: "Addition Time (mins after boiling)",
                type: "number",
                readonly: true,
              },
              done_time: {
                title: "Done",
                type: "string",
              },
            },
          },
        },
      },
    },
    options: {
      fields: {
        additions: {
          toolbarSticky: false, // Don't show toolbar to add/remove items
        },
      },
    },
    data: initial_data,
  });
};

if ($("#logForm").length) {
  var match = window.location.search.match(/(\?|&)data\=([^&]*)/);
  if (match) {
    data = decode_data(match[2]);
  } else {
    // TODO: If there is no data we should ask for a recipe link?
    // OR: We could give them a list of their saved recipes?
    alert("You need a recipe to start a log");
  }
  initialise_log(data);
}
