$(document).ready(function () {
  initDatepickers();
  initActions();

  $('#auto_cancelation_fee').on('click', function(e){
    e.preventDefault();
    //TODO
    //$('#reservation_cancel_cancelationFee').val(0);
  });
});

var initActions = function() {
	$('#sendDocuToRetailer').on('click', function() {
		var reservationId = $('#sendDocuToRetailer').attr('data-reservation');
		var url = $('#sendDocuToRetailer').attr('data-url');
		$.ajax({
			type: "POST",
			url: url,
			data: {reservationId: reservationId},
			success: function(r) {
        var response = jQuery.parseJSON(r);
				$('#sendDocuToRetailer').html(response[0]);
				$('#sendDocuToRetailer').attr('disabled', 'disabled');
				$('#sendDocuToRetailer').css('background-color', 'green');
			}
		});
	});
  
  $('#sendDocuRetailer').on('click', function() {
		var reservationId = $('#sendDocuRetailer').attr('data-reservation');
		var url = $('#sendDocuRetailer').attr('data-url');
		$.ajax({
			type: "POST",
			url: url,
			data: {reservationId: reservationId, singleDocu: 'singleDocu'},
			success: function(r) {
        var response = jQuery.parseJSON(r);
				$('#sendDocuRetailer').html(response[0]);
				$('#sendDocuRetailer').attr('disabled', 'disabled');
				$('#sendDocuRetailer').css('background-color', 'green');
			}
		});
	});
}

/**
 * initModalConfirmTexts.
 * Initialization of the messages showns in the modalbox confirmation for the tour and period
 * listings.
 */
initModalConfirmTexts = function() {
  $('a.reservationdelete').bind('click', function(){
    var alertTxt = 'The reservation is going to be deleted.';
    $('#modal-confirm').find('div.modal-body').html(alertTxt);
  });

  $('a.reservationsuspend').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The reservation is going to be suspended.');
  });

  $('a.reservationnotpaid').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The reservation is going to be set as Not Paid.');
  });
  
  $('a.reservationsetpaid').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('A new payment will be added with the amount necessary to arrive to the net price of the reservation.');
  });
};


initModalConfirmTexts();