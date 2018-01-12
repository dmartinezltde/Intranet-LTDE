$('a.saveAndRooms').bind('click', function(e){
    accommodation_resource_form = $('form[name="accommodation_resource_form"]')
    e.preventDefault();
    $('#redirectTo').val('rooms');
    accommodation_resource_form.submit();
});

$('button.submitButton').bind('click', function(e){
    accommodation_resource_form = $('form[name="accommodation_resource_form"]')
    e.preventDefault();
    $('#redirectTo').val('');
    accommodation_resource_form.submit();
}); 
