$( document ).ready(function() {

  //To link states to location selector
  var byStates = function() {
    for (var key in states) {
      $('<option>').val(key).text(states[key]).appendTo('#state');
    }
    // Search and alert by selected state
    $('#state').change(function(){
      alert("Selected state is : " + $('#state').val());
    });
  };

  byStates();

  var resetLevelTwo = function () {
    $('#levelTwo').html(""); // clears out the existing stuff
    $('<option>').text("All").appendTo('#levelTwo');
  };

  var resetLevelThree = function () {
    $('#levelThree').html(""); // clears out the existing stuff
    $('<option>').text("All").appendTo('#levelThree');
  };

//To dynamically generate program
  var byProgram = function() {
    for (var levelOneName in programCip) { //Loop through first element of obj
      var cip      = programCip[levelOneName].cip;
      var $newElem = $('<option>');
      $newElem.text(levelOneName).data("cip", cip);
      $newElem.appendTo('#levelOne'); //Creates dropdown elem with each lvl1name and append to dropdown menu
    }

    $('#levelOne').change(function(){ //Detects change in lvl 1 menu
      resetLevelTwo();
      resetLevelThree();
      var levelOneChoice = $('#levelOne').val(); //Stores lvl1 choice in var
      if (levelOneChoice === 'All') { return false; }

      var levelTwo = programCip[levelOneChoice].sub; //set lvl2 as sub of lvl1 choice
      for (var levelTwoName in levelTwo) {
        var cip      = levelTwo[levelTwoName].cip;
        var $newElem = $('<option>');
        $newElem.text(levelTwoName).data("parent", levelOneChoice).data("cip", cip);
        $newElem.appendTo('#levelTwo');
      }
    });

    $('#levelTwo').change(function(){
      resetLevelThree();
      var levelTwoChoice = $('#levelTwo').val();
      if (levelTwoChoice === 'All') { return false; }

      var levelOneChoice = $('#levelTwo option:selected').data("parent");
      var levelThree     = programCip[levelOneChoice].sub[levelTwoChoice].sub;
      for (var levelThreeName in levelThree) {
        var cip      = levelThree[levelThreeName].cip;
        var $newElem = $('<option>');
        $newElem.text(levelThreeName).data("cip", cip);
        $newElem.appendTo('#levelThree');
      }
    });
  };

  byProgram();


});








