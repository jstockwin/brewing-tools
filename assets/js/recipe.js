var DEFAULT_DATA = {
  title: "My Recipe",
  malts: [{ name: "Example Malt", quantity: 5, specific_gravity: 1.04 }],
  hops: [{ name: "Example Hop", alpha: 7.5, quantity: 100, boil_time: 60 }],
  yeast: { name: "Example Yeast", attenuation: 75 },
  expected_mash_efficiency: 75,
  total_boil_time: 60,
  post_boil_volume: 22,
};

var initialise = function (data) {
  if (data === undefined) {
    data = DEFAULT_DATA;
  }
  config = {
    schema: {
      type: "object",
      title: "Brewing Recipe",
      properties: {
        title: {
          type: "string",
          title: "Recipe Title",
        },
        malts: {
          type: "array",
          title: "Malts",
          items: {
            type: "object",
            properties: {
              name: {
                title: "Name",
                type: "string",
              },
              quantity: {
                title: "Quantity (kg)",
                type: "number",
              },
              specific_gravity: {
                title: "Specific Gravity",
                type: "number",
              },
            },
          },
        },
        hops: {
          type: "array",
          title: "Hops",
          items: {
            type: "object",
            properties: {
              name: {
                title: "Name",
                type: "string",
              },
              quantity: {
                title: "Quantity (g)",
                type: "number",
              },
              alpha: {
                title: "Alpha",
                type: "number",
              },
              boil_time: {
                title: "Boil Time (mins)",
                type: "number",
              },
            },
          },
        },
        yeast: {
          type: "object",
          title: "Yeast",
          properties: {
            name: {
              title: "Name",
              type: "string",
            },
            attenuation: {
              title: "Attenuation (%)",
              type: "number",
              minimum: 0,
              maximum: 100,
            },
          },
        },
        expected_mash_efficiency: {
          type: "number",
          title: "Expected Mash Efficiency (%)",
          minimum: 0,
          maximum: 100,
        },
        total_boil_time: {
          type: "number",
          title: "Total Boil Time (mins)",
          minimum: 0,
        },
        post_boil_volume: {
          type: "number",
          title: "Expected post-boil volume (L)",
          minimum: 0,
        },
      },
    },
    options: {
      fields: {
        malts: {
          toolbarSticky: true,
          toolbar: { showLabels: true },
          actionbar: { showLabels: true },
        },
      },
      form: {
        buttons: {
          get_link: {
            title: "Get Link",
            click: function () {
              get_link(this.getValue());
            },
          },
          save: {
            title: "Save",
            click: function () {
              save(this.getValue());
            },
          },
          load: {
            title: "Load",
            click: function () {
              select_saved();
            },
          },
          brew: {
            title: "Brew with this recipe",
            click: function () {
              brew(this.getValue());
            },
          },
        },
      },
    },
    // TODO: Needs lots of improvement...
    view: {
      parent: "bootstrap-edit",
      fields: {
        "/malts": {
          templates: {
            "container-object": "#malt-template",
          },
        },
        "/hops": {
          templates: {
            "container-object": "#hops-template",
          },
        },
      },
    },
    data: data,
    postRender: function (control) {
      for (i = 0; i < control.children.length; i++) {
        control.children[i].on("change", function () {
          on_change();
        });
        control.children[i].on("move", function () {
          on_change();
        });
        control.children[i].on("add", function () {
          on_change();
        });
        control.children[i].on("remove", function () {
          on_change();
        });
      }
      on_change();
    },
  };

  $("#recipeForm").alpaca(config);
};

if ($("#recipeForm").length) {
  var data;
  var match = window.location.search.match(/(\?|&)data\=([^&]*)/);
  if (match) {
    decode_recipe(match[2]).then(function (data) {
      initialise(data);
    });
  } else {
    initialise();
  }
}
