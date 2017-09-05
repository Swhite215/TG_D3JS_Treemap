//Script To Navigate Treemap Transitions to Alternate position
var currentLevel = jQuery(".grandparent text").text().split("»").length;

function navigate() {
  if (currentLevel === 1) {
    regionMove(region, lma, dealer);
  } else if (currentLevel === 2) {

    var currentRegion = jQuery(".grandparent text").text().split("»")[1].replace(/\(.*\)/,'').trim();

    if (currentRegion !== region) {
      $(".grandparent")[0].__onclick();
      setTimeout(function() {
        currentLevel--;
        navigate();
      }, 1000);
    } else {
      lmaMove(lma, dealer);
    }

  } else if (currentLevel === 3) {

    var currentLMA = jQuery(".grandparent text").text().split("»")[2].replace(/\(.*\)/,'').trim();

    if (currentLMA !== lma) {
      $(".grandparent")[0].__onclick();
      setTimeout(function() {
        currentLevel--;
        navigate();
      }, 1000);
    } else {
      dealerMove(dealer);
    }


  } else if (currentLevel === 4) {
    $(".grandparent")[0].__onclick();
    setTimeout(function() {
      currentLevel--;
      navigate();
    }, 1000);
  } else if (currentLevel > 4) {
    //What doo I do?
  }
}

navigate();
