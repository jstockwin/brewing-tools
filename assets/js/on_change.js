var on_change = function () {
  var data = $("#recipeForm").alpaca("get").getValue();
  // Calculate original gravity
  var malts = data.malts;
  var gravity_points = 0;
  for (var i = 0; i < malts.length; i++) {
    var malt = malts[i];
    gravity_points +=
      (malt.specific_gravity * 1000 - 1000) * malt.quantity * 2.20462262185;
  }
  var mash_efficiency = data.expected_mash_efficiency / 100;
  var post_boil_volume_gallons = data.post_boil_volume * 0.219969;
  var original_gravity_points =
    (gravity_points * mash_efficiency) / post_boil_volume_gallons;
  var original_gravity = (original_gravity_points + 1000) / 1000;
  if (original_gravity > 0) {
    $("#original_gravity").html(original_gravity);
  }
  // Calculate final gravity
  var final_gravity =
    1 + (original_gravity_points * (1 - data.yeast.attenuation / 100)) / 1000;
  if (final_gravity) {
    $("#final_gravity").html(final_gravity);
  }
  // Note: This is the approximate formula
  var abv = (original_gravity - final_gravity) * 131.25;
  if (abv) {
    $("#abv").html(abv);
  }
  // Calculate IBU
  // TODO: Boil time is the actual time that it boils for. We should actually ask
  // for the total boil time and the addition time, and then calculate the boil
  // time.
  var hops = data.hops;
  var bigness_factor = 1.65 * 0.000125 ** (original_gravity - 1);
  var ibu = 0;
  for (var i = 0; i < hops.length; i++) {
    var hop = hops[i];
    var boil_time_factor = (1 - Math.exp(-0.04 * hop.boil_time)) / 4.15;
    var utilisation = bigness_factor * boil_time_factor;
    var quantity_ounces = hop.quantity * 0.03527396194958;
    ibu +=
      (utilisation * ((hop.alpha / 100) * quantity_ounces * 7489)) /
      post_boil_volume_gallons;
  }
  if (ibu) {
    $("#ibu").html(ibu);
  }
};
