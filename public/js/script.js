$( document ).ready(function() {

  //To link states to location selector
  var byStates = function() {
    for (var key in states) {
      $('<option>').val(key).text(states[key]).appendTo('#state');
    }
    // Search and fill by selected state
    $("#state").change(function(){
      alert("Selected state is : " + $("#state").val());
    });
  }

  byStates();
});








