/**
 * initModalConfirmTexts.
 * Initialization of the messages showns in the modalbox confirmation for the tour and period
 * listings.
 */
initModalConfirmTexts = function() {
  $('a.delete-category').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('You are sure to delete this category?.');
  });
};

$(document).ready(function() {
  initModalConfirmTexts();
  var initial_number_of_days = $('#itinerary_number_of_days').val();

  $('form[name="itinerary"]').on('submit', function(e){
    var num_days = $('#itinerary_number_of_days').val();

    if (!isNaN(initial_number_of_days) && parseInt(initial_number_of_days) > parseInt(num_days)) {
      var days_to_remove = initial_number_of_days - num_days;
      return confirm(days_to_remove + ' days are going to be deleted from the itinerary, because the '
        + 'number of days introduced is less than the initial number of days. '
        + 'Proceed with the modification and delete the last days?');
    } else {
      return true;
    }
  });
});
