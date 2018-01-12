handleTimePickers();
handleTimePickers();

$('#activity_competition').bind('change', function(){
  if ($(this).val() > 0) {
    $('#activityCompetitionGroupDiv').show();

    $('#optionalDiv').hide();
    $('#activity_optional').val('');
    $('#reservationFluxDiv').hide();
    $('#activity_reservationFlux').val('');
  } else {
    $('#optionalDiv').show();
    $('#reservationFluxDiv').show();

    $('#activityCompetitionGroupDiv').hide();
    $('#activity_activityCompetitionGroup').val('');
  }
});

$('#activity_optional').bind('change', function(){
  if ($(this).val() > 0) {
    $('#reserveTimeDiv').show();
  } else {
    $('#reserveTimeDiv').hide();
    $('#activity_reserveTime').val('');
  }
});

function countDaysChecked() {
  var numC = 0;
  $('#activity_present_in_days').find('input[type="checkbox"]').each(function(i, e){
    if (e.checked) {
      numC++;
    }
  });

  return numC;
}

function showHidePresentInDaysAlert() {
  if (countDaysChecked() > 1) {
    $('#present_id_days_info').fadeIn();
  } else {
    $('#present_id_days_info').fadeOut();
  }
}

$('#activity_present_in_days').find('input[type="checkbox"]').bind('click', function(){
  showHidePresentInDaysAlert();
});
showHidePresentInDaysAlert();

/**
 * Links to the service assignment page shoult be "filled" with category and priority values.
 */
$('a.assignLink').bind('click', function(e){
  var row = $(this).parent().parent();
  var rank = row.find('select.service_rank > option:selected').val();
  if (rank == '' || isNaN(rank)) {
    rank = 0;
  }

  var cat = '';
  row.find('input[type="checkbox"]').each(function(){
    if ($(this).prop('checked')) {
      cat += $(this).val() + ',';
    }
  });
  if (cat == '') {
    cat = 0;
  }

  var href = $(this).attr('href');
  var newHref = href.replace('PP', rank).replace('CC', cat);
  $(this).attr('href', newHref);
});


initModalConfirmTexts = function() {
  var modal_confirm = $('#modal-confirm');
  $('a.confirm_activity').bind('click', function(){

    /* Check if the activity has associates services or not, to do so check if there is a <td> with
     * class noservices. */
    var tr = $(this).parent().parent();
    var noservices = tr.find('td.noservices');
    if (noservices.length > 0) {
      var alertTxt = 'Warning! There is at least one period in witch this activity does not have an '
        + 'assigned service. Are you sure that you want to confirm?'
    } else {
      var activity_name = tr.find('td.activity_name').text();
      var alertTxt = 'You are going to confirm the activity "' + activity_name + '". Are you sure?';
    }

    modal_confirm.find('div.modal-header').html('Confirm activity');
    modal_confirm.find('div.modal-body').html(alertTxt);
  });

  $('a.deleteactivity').bind('click', function(){
    modal_confirm.find('div.modal-header').html('Confirm activity removal');
    modal_confirm.find('div.modal-body').html('You are about to delete the activity and related services. Are you sure?');
  });
};
initModalConfirmTexts();

/**
 * dayTypeFormAdaptation.
 * Make some modifications on the visibility of form elements to adapt to the dayType activity.
 */
dayTypeFormAdaptation = function() {
  //$('#activity_rank').parent().parent().hide();
  $('#activity_servicesTxt').parent().parent().hide();
  $('#activity_present_in_days').parent().parent().hide();
  $('#activity_confirmed').parent().parent().hide();
};
