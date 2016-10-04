$( document ).ready(function() {

  //To link states to location selector
  var byStates = function() {
    for (var key in states) {
      $('<option>').val(key).text(states[key]).appendTo('#state');
    }
    // Search and alert by selected state
    $("#state").change(function(){
      alert("Selected state is : " + $("#state").val());
    });
  }

  byStates();

//To dynamically generate program
  var byProgram = function() {
    for (var key1 in programCip) {
      var levelOneName = key1;
      $('<option>').text(levelOneName).appendTo('#program');
    }

  }

  byProgram();


});








