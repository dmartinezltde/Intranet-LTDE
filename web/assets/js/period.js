$(document).ready(function () {
  var dayOneInput = $('#period_dayOne');
  var originalDate = dayOneInput.val();
  var modal = $('#period_date_change_confirm');

  //action "cancel" for the confirmation modal, that sets the date to the original value
  modal.find('button.btn-default').on('click', function(){
    dayOneInput.val(originalDate);
    modal.modal('hide');
  });

  //Check the services for the new date when the date changes.
  dayOneInput.on('change', function(){
    $.ajax({
      url: checkServicesUrl.replace('XXX', $(this).val())
    }).complete(function(data) {
      if (data['responseText'] != '1') { //error
        modal.modal();
      }
    });
  });

  // Open modal fancybox with custom with
  $('#reservationFields a.fancyModal').fancybox({
    type: 'iframe',
    width: 1000,
    minWidth: 500,
    height: 'auto',
    minHeight: 200,
    maxHeight: 600,
    cyclic: false
  });
});

// Javi added, copied from the strategy used in tour tags
initDelTags(false);

initDatepickers();

