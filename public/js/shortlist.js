$(document).ready(function(){

// Grabbing text info from saved colleges to present in wishlist
  $('.choose').on('click', function(e){
    // prevent to redirect to another/same page
    e.preventDefault();

    // get values from html & add to user db
    var $college = $(e.target).parents('.college-wrapper');

    var name = $college.find('.college-info h2').text();
    var address = $college.find('.college-info p').text();
    var url = $college.find('.college-info a').attr('href');

    $.ajax({
        url:'/shortlist',
        type:'POST',
        data:{name:name, address:address, url:url},
        success: function(data){
            $('#name').html(name);
            $('#address').html(address);
            $('#url').html(url);
            alert('college saved');
        },
        error: function(err){
            alert(JSON.stringify(err));
        }
    })
  });


}); //End doc ready






