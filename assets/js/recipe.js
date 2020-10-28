var DEFAULT_DATA = {
  title: "My Recipe",
  malts: [{ name: "Example Malt", quantity: 5, specificGravity: 1.04 }],
  hops: [{ name: "Example Hop", alpha: 7.5, quantity: 100, boilTime: 60 }],
  yeast: { name: "Example Yeast", attenuation: 75 },
  expectedMashEfficiency: 75,
  totalBoilTime: 60,
  postBoilVolume: 22,
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
              specificGravity: {
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
              boilTime: {
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
        expectedMashEfficiency: {
          type: "number",
          title: "Expected Mash Efficiency (%)",
          minimum: 0,
          maximum: 100,
        },
        totalBoilTime: {
          type: "number",
          title: "Total Boil Time (mins)",
          minimum: 0,
        },
        postBoilVolume: {
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
          getLink: {
            title: "Get Link",
            click: function () {
              getLink(this.getValue());
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
              selectSaved();
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
    decodeRecipe(match[2]).then(function (data) {
      initialise(data);
    });
  } else {
    initialise();
  }
}
