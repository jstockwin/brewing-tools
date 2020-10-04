$("#form").alpaca({
  schema: {
    type: "object",
    title: "Brewing Recipe",
    properties: {
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
  },
  postRender: function (control) {
    for (i = 0; i < control.children.length; i++) {
      control.children[i].on("change", function () {
        on_change();
      });
    }
  },
});
