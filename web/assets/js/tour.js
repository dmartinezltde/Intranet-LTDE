function initAutocomplete(ajax_route) {
  var filterform = $('form[name="tour_filter"]');
  initDestinationAutocomplete(ajax_route, 0, filterform, '#tour_filter_destinationId', '#tour_filter_destination');
}

/**
 * setUpdateTourTableContainer.
 * Binds the onClick event to the "show" links in the tours table, for itineraries or periods. So
 * the called actions executes via ajax and the response is printed in the designated div.
 *
 * @param type string Can be "itineraries" or "periods"
 */
function setUpdateTourTableContainer(type) {
  $('div.' + type + ' > a.updateList').bind('click', function(e){   // JAVI REPLACED FROM bind TO on
  //$('div.' + type).on('click', "a.updateList", function(e){  // The change to on does not work because it is nested :(
    e.preventDefault();
    var container = $(this).closest('div.' + type);
    var url = $(this).attr('href');

    updateFromAjax(url, '#' + container.attr('id'), false);
  });
}

initItineraryListeners = function() {
  setUpdateTourTableContainer('itineraries');
  initModalConfirmTexts();
};

initPeriodListeners = function() {
  setUpdateTourTableContainer('periods');
  initModalConfirmTexts();
};

/**
 * initModalConfirmTexts.
 * Initialization of the messages showns in the modalbox confirmation for the tour and period
 * listings.
 */
initModalConfirmTexts = function() {
  $('a.changestatus').bind('click', function(){
    var alertTxt = 'This action will ' + $(this).text() + ' all periods of the tour.';
    $('#modal-confirm').find('div.modal-body').html(alertTxt);
  });

  $('a.deletetour').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The tour is going to be deleted.');
  });

  $('a.deleteitinerary').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The itinerary and all related periods will be deleted.');
  });

  $('a.deleteperiod').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The period will be deleted.');
  });

  $('a.publishitinerary').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('This action will publish all the periods of the itinerary.');
  });

  //To load the content (via ajax) in the modal-body
  $("#duplicate_tour_modal").on("show.bs.modal", function(e) {
    var link = $(e.relatedTarget);
    $(this).find(".modal-body").load(link.attr("href"));
  });
};

/**
 * tourSelector.
 * Initializes the selection of tours from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the tour ID in the parent form
 * @param inputName string Selector for the input for the tour name in the parent form
 * @param returnPath string
 * @param parentReferer string
 */
function tourSelector(inputId, inputName, returnPath, parentReferer) {
  $('table.table').on('click', 'button.select', function() {
    var btn = $(this);
    var name = btn.closest('tr').find('td.dName').text();
    var id = parseInt(btn.attr('data-tour'));

    if (parentReferer) {
      parent.$('#' + inputName).val(name);
      parent.$('#' + inputId).val(id);
      parent.jQuery.fancybox.close();
    } else {
      // Only for debug
      $('#' + inputName).val(name);
      $('#' + inputId).val(id);      
    }
  });
}

initDelDestinations();
initDelTags(false);
initDatepickers();

initItineraryListeners();
initPeriodListeners();
initModalConfirmTexts();


jQuery(document).ready(function() {
  $('#generate_services_text').bind('click', function (e) {
    e.preventDefault();

    $.ajax({
      url: generate_text_services_url
    }).complete(function(data) {
      $('#tour_servicesTxt').val(data['responseText']);
    });
  });

  $('#reservationFields').find('a.fancyModal').fancybox({
    type: 'iframe',
    width: 1000,
    minWidth: 500,
    height: 'auto',
    minHeight: 200,
    maxHeight: 600,
    cyclic: false
  });
});
