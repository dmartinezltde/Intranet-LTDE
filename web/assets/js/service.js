/**
 * initBloodhoundProviders.
 * Initializes the source of the providers autocompleter.
 *
 * @param route string
 * @returns {*|e}
 */
function initBloodhoundProviders(route) {
  var providers = new Bloodhound({
    datumTokenizer: function (providers) {
      return Bloodhound.tokenizers.whitespace(providers.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
      url: route + '/QUERY',
      wildcard: 'QUERY'
    }
  });
  providers.initialize();

  return providers;
}

/**
 * initBloodhoundContracts.
 * Initializes the source of the contracts autocompleter.
 *
 * @param route string
 * @returns {*|e}
 */
function initBloodhoundContracts(route) {
  var contracts = new Bloodhound({
    datumTokenizer: function (contracts) {
      return Bloodhound.tokenizers.whitespace(contracts.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
      url: route + '/QUERY',
      wildcard: 'QUERY'
    }
  });
  contracts.initialize();

  return contracts;
}

/**
 * initProvidersAutocomplete.
 * Initializes the selection of the provider ID from the autocompleter.
 *
 * @param route string
 * @param form Object
 * @param inputIdSelector string
 * @param sourceSelector string The selector for the input where the user types (usually '.typehead')
 * @returns {*|e}
 */
function initProvidersAutocomplete(route, form, inputIdSelector, sourceSelector) {
  var providers = initBloodhoundProviders(route);

  form.find(sourceSelector).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'providers',
      displayKey: function (provider) {
        form.find(inputIdSelector).val(provider.id);
        return provider.name;
      },
      source: providers.ttAdapter()
    }).on('typeahead:selected', function(e, obj){
      setContractsOptions();
      $('#service_contract').val('');
      $('#service_contractId').val('');
    });
}

/**
 * initDestinationAutocomplete.
 * Initializes the selection of the destination ID from the autocompleter.
 *
 * @param route string
 * @param form Object
 * @param inputIdSelector string
 * @param sourceSelector string The selector for the input where the user types (usually '.typehead')
 * @returns {*|e}
 */
function initContractsAutocomplete(route, form, inputIdSelector, sourceSelector) {
  inputIdSelector = inputIdSelector || "#service_contractId";
  sourceSelector  = sourceSelector  || "#service_contract";
  var contracts   = initBloodhoundContracts(route);

  /* Destroy the actual typehead before initializing, because maybe there is one working, and in
   * that case we'll end with two resultsets for the same input. This occurs when provider changes */
  form.find(sourceSelector).typeahead('destroy');
  form.find(sourceSelector).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'contracts',
      displayKey: function (contract) {
        form.find(inputIdSelector).val(contract.id);
        return contract.name;
      },
      source: contracts.ttAdapter()
    }).on('typeahead:selected', function(e, obj){
      $('#service_contractId').val(obj.id);
    });
}

/*
 * var urlContract link of call search contract
 */
var urlContract = '';

/*
 * var urlContract link of call search contract
 */
var serviceForm;

/**
 * setContractsOptions.
 * Depending on the provider value, change identificador of provider on link.
 */
function setContractsOptions() {
  var provId = parseInt($('#service_providerId').val());
  var selectorContract = $('#selector-contract');
  if (provId <= 0 || isNaN(provId)) {
    provId = 0;
  }

  /*
   * Update link to call the modal window Contracts
   */
  var link = selectorContract.attr('href');
  var providerIdLink = link.match(/\d+/);
  var updateLink = link.replace(providerIdLink,provId);
  selectorContract.attr('href', updateLink);

  /*
   * Update link to call the autocomplete contracts
   */
  urlContract = urlContract.replace(/search\/\d+/,'search/' + provId);
  initContractsAutocomplete(urlContract, serviceForm);
}

/**
 * initServiceForm.
 *
 * @param providerSearch string URL for the providers autocomplete
 * @param contractSearch string URL for the contracts autocomplete
 * @param destination_search string Base URL to load the destination autocompleter
 * @param segmentsLoad string URL to obtain the segments forms and include them in the page
 * @param numGoSegments int
 * @param numReturnSegments int
 */
initServiceForm = function(providerSearch, contractSearch, destination_search, segmentsLoad, numGoSegments, numReturnSegments) {
  serviceForm = $('form');
  urlContract = contractSearch;

  initProvidersAutocomplete(providerSearch, serviceForm, '#service_providerId', '#service_provider');
  initContractsAutocomplete(contractSearch, serviceForm, '#service_contractId', '#service_contract');
//  setContractsOptions();

  var service_provider = $('#service_provider');
  service_provider.bind('blur', function(){
    if ($(this).val() == '') {
      $('#service_providerId').val('');
      $('#service_contract').val('');
      $('#service_contractId').val('');
    } else {
      //setContractsOptions();
    }
  });

  service_provider.on('change', function(){
    if ($(this).val() != '') {
      $('#service_providerId').val('');
      $('#service_contract').val('');
      $('#service_contractId').val('');
    }
  });

  $('#service_contract').bind('blur', function(){
    if ($(this).val() == '') {
      $('#service_contractId').val('');
    } else {
      //setContractsOptions();
    }
  });

  var serviceTypeSel = $('#service_type');
  serviceTypeSel.bind('change', function(){
    $('.service_types_form').hide();
    var val = $(this).val();
    if (val == 'Flight') {
      $('#service_type_flight_form').fadeIn();
    } else if (val == 'Accommodation') {
      $('#service_type_accommodation_form').fadeIn();
    } else if (val == 'Guide') {
      $('#service_type_guide_form').fadeIn();
    } else if (val == 'Transport') {
      $('#service_type_transport_form').fadeIn();
    } else if (val == 'Other') {
      $('#service_type_other_form').fadeIn();
    }
  });
  serviceTypeSel.change(); //launch the event to display the embedded form at page load

  $('#service_refreshEmailProviderBody').on('click', function() {
    var body = emailComposer();
    $('#service_emailProviderBody').val(body);
  });

  $('#service_sendEmailProvider').bind('click', function(e){
    if (this.checked) {
      var body = emailComposer();
      $('#service_emailProviderBody').val(body);
      $('#emailProvider').slideDown();
    } else {
      $('#emailProvider').slideUp();
    }
  });


  var serviceTypeFlightFormDiv = $('#service_type_flight_form');

  var numSegmentsGoSel = $('#service_serviceTypeFlight_numSegmentsGo');
  var numSegmentsReturnSel = $('#service_serviceTypeFlight_numSegmentsReturn');
  var serviceTypeFlightSel = $('#service_serviceTypeFlight_type');
  serviceTypeFlightSel.bind('change', function(){
    var val = $(this).val();
    if (val == '1') { //Go
      numSegmentsGoSel.find('option[value=0]').attr('disabled', 'disabled');
      numSegmentsReturnSel.find('option[value=0]').removeAttr('disabled');
      serviceTypeFlightFormDiv.find('div.goField').show();
      serviceTypeFlightFormDiv.find('div.returnField').hide();
      numSegmentsReturnSel.val(0).change();
      $('#return_flight_note').hide();
      $('#returnDateSelector').hide();
    } else if (val == '2') { //Return
      numSegmentsGoSel.find('option[value=0]').removeAttr('disabled');
      numSegmentsReturnSel.find('option[value=0]').attr('disabled', 'disabled');
      serviceTypeFlightFormDiv.find('div.goField').hide();
      serviceTypeFlightFormDiv.find('div.returnField').show();
      numSegmentsGoSel.val(0).change();
      $('#return_flight_note').hide();
      $('#returnDateSelector').hide();
    } else if (val == '3') { //Go and return
      numSegmentsGoSel.find('option[value=0]').attr('disabled', 'disabled');
      numSegmentsReturnSel.find('option[value=0]').attr('disabled', 'disabled');
      serviceTypeFlightFormDiv.find('div.goField').show();
      serviceTypeFlightFormDiv.find('div.returnField').show();
      $('#return_flight_note').show();
      $('#returnDateSelector').show();
    }
  });
  serviceTypeFlightSel.change();

  var contributionSelect = $('#service_serviceTypeFlight_contribution');
  contributionSelect.bind('change', function(){
    if ($(this).val() == 1) {
      $('.contributionDiv').fadeIn();
    } else {
      $('.contributionDiv').hide();

      $('#addFlightsDiv').html(''); //empty the div containing the associated services names
      //Empty the input that contains the IDs of associated services
      $('#service_serviceTypeFlight_contributionIds').val('');
    }
  });
  contributionSelect.change();


  numSegmentsGoSel.bind('change', function(){
    segmentUpdate(segmentsLoad, 'Go', $(this).val(), 'flight_segments_go', destination_search);
  });
  if (numGoSegments > 0) {
    initSegmentForm(destination_search, numGoSegments, 'Go');
  } else if (numGoSegments == 0 && numSegmentsGoSel.val() > 0) {
    /* This code is used when the service does not have saved segments, but the form loads with
     * a value in the segments select. This occurs mainly in validation errors. */
    numSegmentsGoSel.change();
  }

  numSegmentsReturnSel.bind('change', function(){
    segmentUpdate(segmentsLoad, 'Return', $(this).val(), 'flight_segments_return', destination_search);
  });
  if (numReturnSegments > 0) {
    initSegmentForm(destination_search, numReturnSegments, 'Return');
  } else if (numReturnSegments == 0 && numSegmentsReturnSel.val() > 0) {
    /* This code is used when the service does not have saved segments, but the form loads with
     * a value in the segments select. This occurs mainly in validation errors. */
    numSegmentsReturnSel.change();
  }

  $('a.saveAndRooms').bind('click', function(e){
    e.preventDefault();
    $('#redirectTo').val('rooms');
    serviceForm.submit();
  });

  $('a.saveAndDates').bind('click', function(e){
    e.preventDefault();
    $('#redirectTo').val('dates');
    serviceForm.submit();
  });

  $('a.saveAndCalendar').bind('click', function(e){
    e.preventDefault();
    $('#redirectTo').val('calendar');
    serviceForm.submit();
  });

  /* This link has to put the values of the inputs from the first row to all the other rows' inputs */
  copyToAllValuesLinks();

  $('#service_serviceTypeFlight').parent().parent().hide(); //hide the form field of the embedded form

  initDestinationAutocomplete(destination_search, 30, serviceForm,
    '#service_serviceTypeAccommodation_destination', '#service_serviceTypeAccommodation_destinationName');

  removeDestinationsLink();
};

handleTimePickers();

initServiceSelector = function(inputSelect){
  $('button.select').bind('click', function(){
    var destination = parent.$(inputSelect);
    var valactual = destination.val();
    var valnew = $(this).attr('id');
    if (valactual != '') {
      valnew = valactual + ',' + valnew;
    }
    destination.val(valnew);

    var name = $(this).parent().parent().find('td.service_name').text();
    parent.$('div.serviceList').append('<p>' + name + '</p>');

    parent.jQuery.fancybox.close();
  });
};

/**
 * segmentUpdate.
 * Prints the appropiate number of segment forms of the indicated type.
 *
 * @param segmentsLoad string URL to obtain the forms
 * @param type string "Go" or "Return"
 * @param numSeg int Number of segments to create the forms
 * @param destination string The ID of the element in the DOM to put the response
 * @param destination_search string The URL for the ajax call to load the destinations for the autocomplete
 */
segmentUpdate = function(segmentsLoad, type, numSeg, destination, destination_search) {
  if (numSeg > 0) {
    var url = segmentsLoad.replace('YY', type);
    $.ajax({
      url: url.replace('XX', numSeg)
    }).complete(function(data) {
      $('#' + destination).html(data['responseText']);
      initSegmentForm(destination_search, numSeg, type);
    });
  } else {
    $('#' + destination).html('');
  }
};

/**
 * initSegmentForm.
 * Initializes the timepickers and autocompletes for the embedded segment forms.
 *
 * @param destination_search string The URL for the ajax call to load the destinations for the autocomplete
 * @param numSeg Number of segments
 * @param type string "Go" or "Return"
 */
initSegmentForm = function(destination_search, numSeg, type) {
  initTimePickers();

  var serviceForm = $('form[name="service"]');
  var i = 1;
  while (i <= numSeg) {
    //now the initialization of the destination autocompleters for all deperture and arrival cities
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      'input[name="segment[departureCityId_' + type + i + ']"]',
      'input[name="segment[departureCity_' + type + i + ']"]');
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      'input[name="segment[arrivalCityId_' + type + i + ']"]',
      'input[name="segment[arrivalCity_' + type + i + ']"]');
    i++;
  }
};

// Variable to keep the value send to date selector, to know if there is a date edition or a new addition
var originalValue = '';

/**
 * initDatesForm.
 * The initialization of dynamic behaviour for the flight dates table.
 */
initDatesForm = function(firstDate){
  var form = $('#flightDates');
  if (form.length == 0) {
    form = $('form[name="service"]'); //the general service form
  }

  /* When clicking on the edit link, the inputs for the data in the row must be shown. */
  form.find('.editRow').unbind('click');
  form.find('.editRow').bind('click', function(e){
    e.preventDefault();
    var row = $(this).parent().parent();
    row.find('span').hide();
    row.find('input, select, a.dateSelector, div[class="checker"] > span').fadeIn();
    $(this).hide();
  });

  form.find('.cloneRow').unbind('click');
  form.find('.cloneRow').bind('click', function(e){
    e.preventDefault();
    var row = $(this).parent().parent();
    var tableBody = form.find('table > tbody');
    tableBody.append('<tr>' + row.html() + '</tr>');

    var newrow = tableBody.find('tr:last');
    newrow.find('input[name="flight_date_id[]"]').val('');
    newrow.find('input[name="departure_date[]"]').val('');
    newrow.find('strong').text('');
    newrow.find('select[name="type[]"]').val(row.find('select[name="type[]"]').val());
    newrow.find('input[name="net_price[]"]').val(row.find('input[name="net_price[]"]').val());
    newrow.find('input[name="rates[]"]').val(row.find('input[name="rates[]"]').val());
    newrow.find('input[name="stock[]"]').val(row.find('input[name="stock[]"]').val());
    newrow.find('span').hide();
    newrow.find('input, select, a.dateSelector, div[class="checker"] > span').fadeIn();
    newrow.find('a.dateSelector').addClass('btn blue');
    initDatesForm();
  });

  deleteRows();

  setDateSelector(form, 'input[name="departure_date[]"]', '#flight_dates_to_selector');

  var addDates = $('#addDates');
  addDates.unbind('click');
  addDates.bind('click', function(e){
    e.preventDefault();
    addRow('');
  });

  $('.saveDatesAndCalendar').on('click', function(e) {
    e.preventDefault();
    $('#redirectTo').val('calendar');
    form.submit();
  });

  if (firstDate) {
    $('.date-picker').datepicker('setStartDate', firstDate);
  }

  onRequestCheck();
};



/**
 * addRow.
 * Modifies the flight dates table to add a new row.
 * If copyValuesFrom is not empty takes the input values in the row and fills in the new ones.
 *
 * @param copyValuesFrom object The row to take the values from
 */
addRow = function(copyValuesFrom){
  var form = $('#flightDates');
  if (form.length == 0) {
    form = $('form[name="service"]');
  }
  var tableBody = form.find('table > tbody');
  tableBody.append('<tr>' + $('#sampleRow').html() + '</tr>');
  tableBody.find('tr:last').find('input, select, a.dateSelector, div[class="checker"] > span').slideDown();

  //set html5 validation for new rows
  tableBody.find('tr:last').find('input[name="net_price[]"]').attr('required', 'required');
  tableBody.find('tr:last').find('input[name="rates[]"]').attr('required', 'required');
  tableBody.find('tr:last').find('input[name="stock[]"]').attr('required', 'required');
  tableBody.find('tr:last').find('input[name="locator[]"]').attr('required', 'required');

  if (copyValuesFrom != '') {
    tableBody.find('tr:last').find('input[name="type[]"]').val(copyValuesFrom.find('input[name="type[]"]').val());
    tableBody.find('tr:last').find('input[name="net_price[]"]').val(copyValuesFrom.find('input[name="net_price[]"]').val());
    tableBody.find('tr:last').find('input[name="rates[]"]').val(copyValuesFrom.find('input[name="rates[]"]').val());
    tableBody.find('tr:last').find('input[name="stock[]"]').val(copyValuesFrom.find('input[name="stock[]"]').val());
    tableBody.find('tr:last').find('input[name="locator[]"]').val(copyValuesFrom.find('input[name="locator[]"]').val());
    tableBody.find('tr:last').find('input[name="on_request_check[]"]').val(copyValuesFrom.find('input[name="on_request_check[]"]').val());
    tableBody.find('tr:last').find('input[name="on_request[]"]').val(copyValuesFrom.find('input[name="on_request[]"]').val());
  }

  initDatesForm();
};

/**
 * setDateSelector.
 * Before opening the data selector, the dates of the edited row must be set in the designated
 * input and formated.
 *
 * @param form Form
 * @param inputSelector string
 * @param fieldId string
 */
setDateSelector = function(form, inputSelector, fieldId) {
  var dateCopiedFlag = false;
  form.find('a.dateSelector').unbind('click');
  form.find('a.dateSelector').bind('click', function(e){
    var dates_sel_val = '';
    if (dateCopiedFlag) {
      dateCopiedFlag = false;
    } else {
      e.preventDefault();
      var toEdit = $(this).parent().find(inputSelector).val();
      originalValue = toEdit;
      if (toEdit != '') {
        /* Check if the value to edit is a single date or an interval. If it's a single date the
         * value passed to the dateSelector must be a definition of a one-day interval. If is not a
         * single day, then we assume that is an interval. If the format is not correct, no dates
         * will be shown in the selector. */
        if (toEdit.match(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/)) {
          var ts = new Date(toEdit).getTime();
          var arr = [{
            hash: ts,
            dateIni: toEdit,
            dateEnd: null,
            days: null,
            timestamp: ts
          }];
          dates_sel_val = JSON.stringify(arr);
        } else {
          dates_sel_val = '[' + toEdit + ']';
        }
      }
      $(fieldId).val(dates_sel_val);

      dateCopiedFlag = true;
      $(this).trigger('click');
    }
  });
};

/**
 * updateFlightDeparturesFromDateSelector.
 * Using the dates from the dateSelector, this function processes the days and puts each one in one
 * row of the table. IF there is any input with values originally passed to the selector, then it is
 * updated, if not new rows are added.
 */
updateFlightDeparturesFromDateSelector = function(){
  if ($('#flight_dates_to_selector').length) {
    updateTableRowsWithDates('#flight_dates_to_selector', '#flightDatesTable');
    $('#returnDateSelector').show();
  }
};

/**
 * updateFirstDate.
 * Checks if the first date and return date inputs are filled, and if not, then puts the value.
 *
 * @param date string
 */
updateFirstDate = function(date) {
  var firstDate = $('#first_date');
  if (firstDate.val() == '') {
    firstDate.val(date);
    $('#returnDateSelector').find('label.control-label > strong').text(date);
  }

  $('.date-picker').datepicker('setStartDate', firstDate.val());
};


/* ACCOMMODATION DATES FORM */
var changedAddRestrictionsUrl = false;
var num_reservation_modes = 1;

initAccommodationDatesForm = function(num_res_mod){
  if (!isNaN(num_res_mod)) {
    num_reservation_modes = num_res_mod;
  }
  var form = $('form');

  setDateSelector(form, 'input[name="arrival_date[]"]', '#accommodation_dates_to_selector');

  initRatesBuilder();

  /* When clicking on the edit link, the inputs for the data in the row must be shown. */
  form.find('.editRow').unbind('click');
  form.find('.editRow').bind('click', function(e){
    e.preventDefault();
    var row = $(this).parent().parent();
    row.find('span').hide();
    row.find('input, select, a.dateSelector, div[class="checker"] > span').fadeIn();
    row.find('input[name="max_capacity[]"]').blur(); //to start the rates builder
    $(this).hide();
  });

  $('a.ageRestriction').bind('click', function(e){
    if (changedAddRestrictionsUrl === true) {
      changedAddRestrictionsUrl = false;
      return;
    }
    e.preventDefault();
    var max = $(this).parent().parent().find('input[name="max_capacity[]"]').val();
    if (isNaN(max) || max == 0) {
      alert('You must set a maximum capacity before adding restricions.');
      return false;
    }
    var actual_restrictions = $(this).parent().find('input[name="restrictions[]"]').val();
    $(this).parent().find('input[name="restrictions[]"]').val('BEBOP'); //put a token to identify the edited field
    var href = $(this).attr('href');
    var ar = (actual_restrictions == '') ? '0' : actual_restrictions;
    var newHref = href.replace('XX', max).replace('YY', ar);
    $(this).attr('href', newHref);

    changedAddRestrictionsUrl = true;
    $(this).trigger('click');
  });

  $('a.deleteAgeRestriction').bind('click', function(e){
    e.preventDefault();
    $(this).parent().find('input[name="restrictions[]"]').val('');
    $(this).parent().find('span').text('No');
    // Change edit restrictions by add restrictions
    var addRestriction = $(this).parent().find('a.ageRestriction');
    var href = addRestriction.attr('href');
    var newHref = href.replace(/ageRestriction\/(.*)/,'ageRestriction/XX-YY');
    addRestriction.attr('href', newHref);
    addRestriction.text('add restriction');

    $(this).hide();
  });

  var addDates = $('#addDates');
  addDates.unbind('click');
  addDates.bind('click', function(e){
    e.preventDefault();
    addAccommodationRow('');
  });

  deleteRows();

  form.find('.cloneRow').unbind('click');
  form.find('.cloneRow').bind('click', function(e) {
    e.preventDefault();
    var row = $(this).parent().parent();
    var date_val = row.find('input[name="arrival_date[]"]').val();

    if (date_val == '') {
      alert("It's not possible to duplicate a row without date set.");

    } else {
      var tableBody = $('#accommodationDates').find('table > tbody');
      tableBody.find('input[value="' + date_val + '"]').each(function () {
        var this_row = $(this).parent().parent();

        //check that the row that we want to duplicate has all filled data
        if (this_row.find('input[name="arrival_date[]"]').val() != '' // &&
            /*this_row.find('input[name="min_capacity[]"]').val() != '' &&
            this_row.find('input[name="max_capacity[]"]').val() != '' &&
            this_row.find('input[name="beds_individual[]"]').val() != '' &&
            this_row.find('input[name="beds_double[]"]').val() != '' &&
            this_row.find('input[name="beds_extra[]"]').val() != ''*/
        ) {
          tableBody.append('<tr>' + this_row.html() + '</tr>');

          var newrow = tableBody.find('tr:last');
          newrow.find('input[name="accommodation_date_id[]"]').val('');
          newrow.find('input[name="arrival_date[]"]').val('');
          /*
          newrow.find('input[name="min_capacity[]"]').val(this_row.find('input[name="min_capacity[]"]').val());
          newrow.find('input[name="max_capacity[]"]').val(this_row.find('input[name="max_capacity[]"]').val());
          newrow.find('input[name="beds_individual[]"]').val(this_row.find('input[name="beds_individual[]"]').val());
          newrow.find('input[name="beds_double[]"]').val(this_row.find('input[name="beds_double[]"]').val());
          newrow.find('input[name="beds_extra[]"]').val(this_row.find('input[name="beds_extra[]"]').val());*/
          newrow.find('strong').text('');
          newrow.find('span').hide();
          newrow.find('input, select').fadeIn();

          if (this_row.hasClass('sameDateRow')) {
            newrow.addClass('fillData sameDateRow');
          } else {
            newrow.find('a.dateSelector').fadeIn();
            newrow.find('a.dateSelector').addClass('btn blue');
          }
        }
      });
    }
    initAccommodationDatesForm();
  });

  initAddRoom();

  $('.saveDatesAndCalendar').on('click', function(e) {
    e.preventDefault();
    $('#redirectTo').val('calendar');
    form.submit();
  });

  onRequestCheck();

}; //end initAccommodationDatesForm



/**
 * copyRestrictions.
 * Set the text from the general hidden input used from the restrictions modalbox to the input
 * marked with a special value "BEBOP".
 * And then returns the link to the original state.
 */
copyRestrictions = function(){
  var serialized = $('input[name="accommodation_restrictions"]').val();
  var destInput = $('input[value="BEBOP"]');
  destInput.val(serialized);
  destInput.parent().find('span').text('Yes');
  destInput.parent().find('a.ageRestriction').text('edit restriction');
  destInput.parent().find('a.deleteAgeRestriction').show();

  /* Now return the edited href to the original (empty) value, so if the link is used again the
   * wildcards XX and YY will be replaced with updated values. */
  var originalHref = $('#sampleRow').find('a.ageRestriction').attr('href');
  destInput.parent().find('a').attr('href', originalHref);
};


initRatesBuilder = function(){
  var form = $('#accommodationDatesTable');
  form.find('input[name="min_capacity[]"], input[name="max_capacity[]"]').unbind('blur');
  form.find('input[name="min_capacity[]"], input[name="max_capacity[]"]').bind('blur', function(){
    var row = $(this).parent().parent();
    var min = row.find('input[name="min_capacity[]"]').val();
    var max = row.find('input[name="max_capacity[]"]').val();

    if (!isNaN(min) && !isNaN(max) && min != '' && max != '') {
      if (max >= min) {
        var inner = '';
        for (var i= min; i<=max; i++) {
          //To mantain the rate value in editions, first we search for a input with the same name
          var rate_val = '';
          var inputRates = row.find('td.rates input[name="capacity_' + i + '"]');
          if (inputRates.length) {
            rate_val = inputRates.val();
          }
          inner += '<div class="form-group">'
            + '<label class="control-label col-sm-6">Capacity ' + i + ':</label> '
            + '<input type="number" name="capacity_' + i + '" value="' + rate_val + '" class="capacity form-control col-sm-6" style="display:block;"/>'
            + '</div>';
        }
        row.find('td.rates > div').html(inner);
        initCapacityListener();
      } else {
        alert('To input rates the maximum capacity must be equal or superior to minimum capacity.')
      }
    }
  });
};

initCapacityListener = function(){
  $('input.capacity').bind('blur', function(e){
    var td = $(this).parent().parent().parent();
    var caps = [];
    td.find('input.capacity').each(function(){
      var nameParts = $(this).attr('name').split('_');
      caps[nameParts[1]] = $(this).val();
    });
    td.find('input[name="ac_rates[]"]').val(JSON.stringify(caps));
  });
};



/**
 * updateAccommodationArrivalsFromDateSelector.
 * Function executed from the dateSelector in the fancybox when the user has finished. It calls the
 * method to put the dates in the table.
 * The field length check is done because the function is called from other service dates selectos,
 * and need to meke sure that the field we're reading is correct.
 */
updateAccommodationArrivalsFromDateSelector = function(parent){
    
  // JAVI. Why is this code executed when adding dates to guide services?
  
  //JAVI CHANGED THIS STRATEGY. TO IMPROVE.
  //if ($('#accommodation_dates_to_selector').length) {
  if ($('#editable_table_AccommodationDate').length) {
    // JAVI. VERY UGLY. THE PROBLEM IS THAT THE CONTENT IS CREATED AFTER THE PAGE IS RELOADED... HOW TO SOLVE THIS FROM A MODAL?
    // THIS SHOULD BE DONE WITH A SYNC AJAX QUERY FROM THE MODAL
    //setTimeout(function (){updateFromAjax("http://tourknife/app_dev.php/admin/accommodationDate/multiple_edit/7", "#editable_table_AccommodationDate", true, true)}, 2000);
    // TO IMPROVE. IT DO NOT LIKE THIS (JAVI)
  
    /* JAVI ADDED */
    if( typeof parent != 'undefined' ){
      //setTimeout(function (){parent.location.reload();}, 2000);
      setTimeout(function (){window.location.reload();}, 2000);
    }
    
    return;  //JAVI ADDED //
    
    
    updateTableRowsWithDates('#accommodation_dates_to_selector', '#accommodationDatesTable');

    /* If there is more than one reservation mode, means that when inserting new dates in the form,
     * some rows will have the arrival_date input empty, because on selecting a date only fills the
     * "main row" input, not the ones with .sameDateRow */
    if (num_reservation_modes > 1) {
      // Make sure that all .sameDateRow have the date filled
      var date_val = '';
      $('#accommodationDatesTable').find('tr').each(function(){
        var dateInput = $(this).find('input[name="arrival_date[]"]');

        if ($(this).hasClass('sameDateRow')) {
          dateInput.val(date_val);
        } else {
          date_val = dateInput.val();
        }
      });
    }
  }
};

/**
 * updateTableRowsWithDates.
 * Put the dates selected with the dateSelector fancybox as rows in tha dates table.
 *
 * @param datesSelector string Selector for the input when the selected dates are put
 * @param table string Selector for the table that contains the dates
 */
updateTableRowsWithDates = function(datesSelector, table){
  var objs = JSON.parse($(datesSelector).val());
  var copyValuesFrom = '';
  for (var i in objs) {
    var DatesTable = $(table);

    var inputVal;
    var textVal;
    if (objs[i].dateEnd == '' || objs[i].dateEnd == null) { //There is only one date per obj
      inputVal = objs[i].dateIni;
      textVal = objs[i].dateIni;
    } else { //interval mode
      inputVal = JSON.stringify(objs[i]);
      textVal = objs[i].dateIni + ' to ' + objs[i].dateEnd;
      if (objs[i].days != '' && objs[i].days != null) {
        textVal += ', ';
        objs[i].days.split(',').forEach(function(d){
          textVal += weekDay(d) + ' ';
        });
      }
    }

    var editedInput;
    /* If there is a value in originalValue, means that the user has edited a row, so we must
     * search that input and replace the value. If no originalValue is set, then we can put the
     * value in a new row. */
    if (originalValue != '') {
      editedInput = DatesTable.find('input[value=\'' + originalValue + '\']');
      copyValuesFrom = editedInput.parent().parent();
      originalValue = ''; //controller variable is returned to original state
    } else {
      editedInput = DatesTable.find('tr:not(.sameDateRow) input.dep_date_val[value=""]:last'); //the empty input

      /* Take in count that if the empty input we have found is the one in sampleRow, we can't
       * fill it, so we need to add a row and put the value there. */
      var row = editedInput.parent().parent();
      if (row.attr('id') == 'sampleRow') {
        addRowToTable(datesSelector, copyValuesFrom);

        editedInput = DatesTable.find('tr:not(.sameDateRow) input.dep_date_val[value=""]:last');
      }
    }
    editedInput.val(inputVal);
    editedInput.parent().find('strong').text(textVal);
    editedInput.parent().find('.dateSelector').removeClass('btn blue');

    if (datesSelector == '#flight_dates_to_selector') {
      updateFirstDate(objs[i].dateIni);
    }
  } //end for objs
};

/**
 * addRowToTable.
 * This function adds a row to the dates table, depending on the date selector pased uses the
 * corresponding function for the servide type.
 *
 * @param datesSelector string
 * @param copyValuesFrom object
 */
addRowToTable = function (datesSelector, copyValuesFrom) {
  if (datesSelector == '#flight_dates_to_selector') {
    addRow(copyValuesFrom);
  } else if (datesSelector == '#accommodation_dates_to_selector') {
    addAccommodationRow(copyValuesFrom);
  } else if (datesSelector == '#guide_dates_to_selector') {
    addGuideRow(copyValuesFrom);
  }
};

/**
 * weekDay.
 * Returns the name of tha day of the week of the given day number.
 *
 * @param n int From 0 (sunday) to 6 (saturday)
 * @return string
 */
function weekDay(n) {
  var d = '';
  switch (n) {
    case '0':
      d = 'sunday';
      break;
    case '1':
      d = 'monday';
      break;
    case '2':
      d = 'tuesday';
      break;
    case '3':
      d = 'wednesday';
      break;
    case '4':
      d = 'thursday';
      break;
    case '5':
      d = 'friday';
      break;
    case '6':
      d = 'saturday';
      break;
  }
  return d;
}

/**
 * emailComposer.
 * Initialization of the function that creates the email to send to the provider when the user
 * clicks in the checkbox.
 */
emailComposer = function(){
  //$('#service_emailProviderSubject').val('Booking request from ' + wholesaler + ' ' + loggeduser);  //JAVI CHANGED
  $('#service_emailProviderSubject').val('Booking request from The Wholesaler');  // JAVI: Need to adapt the name according to the majorist
  var body = $('#providerEmailBodySample').text();
  body = body.replace('[PROVIDER]', $('#service_provider').val());
  body = body.replace('[SERVICE_NAME]', $('#service_name').val());
  body = body.replace('[SERVICE_DESCRIPTION]', $('#service_description').val());

  var dates = '';
  var table = $('table.serviceDataTable');
  var service_type = $('#service_type').val();
  
  if (service_type == 'Accommodation') { //accommodation services

    var datestr = '';
    var rows = table.find('tbody > tr.fillData:visible');

    rows.each(function () {
		
      /* JAVI CHANGED */
      /*
      var minCap = getValueElement($(this), 'td.mincap')
      var maxCap = getValueElement($(this), 'td.maxcap')
      var bedi = getValueElement($(this), 'td.bedi')
      var bedd = getValueElement($(this), 'td.bedd')
      var bede = getValueElement($(this), 'td.bede')
      var stock = getValueElement($(this), 'td.stock')
      // If there is a value in one of these variables, then we will print line
      if (minCap || maxCap || bedi || bedd || bede || stock) {
        if ($(this).find('td.dates > strong').text() != datestr) { //date change
          datestr = $(this).find('td.dates > strong').text();
          dates += "\n" + datestr + "\n";
        }

        dates += 'Min. cap.: ' + minCap;
        dates += ' | Max. cap.: ' + maxCap;
        dates += ' | Individual beds: ' + bedi;
        dates += ' | Double beds: ' + bedd;
        dates += ' | Extra beds: ' + bede;
        dates += ' | Stock: ' + stock;
        dates += "\n";
      }*/
      
      // If there is a value in one of these variables, then we will print line
      //alert(getValueElement($(this), 'td');
	  
	  var arrivalDate = $(this).find('td.Interval').text().trim();
	  var stock = $(this).find('td.stock').text().trim();
	  var roomType = $(this).find('td.Room').text().trim();
    
    if (arrivalDate!=""){ dates += "\n\n" + arrivalDate + "\n"; }
	  dates += ' | Room type: ' + roomType + "\t";
	  dates += ' Stock: ' + stock + '\n';

      // Show button for refresh content email
      $('.refresh-email').show();
    });

  } else if (service_type == 'Flight') { //flight services
    var rows = table.find('tbody > tr.fillData:visible');
    rows.each(function () {
      var stock = getValueElement($(this), 'td.stock');
      if (stock) {
        dates += "\n" + $(this).find('td.dates strong').text();
        dates += " | stock: " + stock;
        dates += "\n";
      }
    });

    // Show button for refresh content email
    $('.refresh-email').show();

    dates += "\nFlight times:\n";
    var idx = 1;
    $('#flight_segments_go').find('div.segment').each(function(){
      if (idx == 1) {
        dates += "Outbound\n";
      }
      dates += "  Depart from " + $('#segment_departureCity_Go' + idx).val() + " at " + $('#segment_departureTime_Go' + idx).val() + "\n";
      dates += "  Arrive in " + $('#segment_arrivalCity_Go' + idx).val() + " at " + $('#segment_arrivalTime_Go' + idx).val() + "\n";
      idx++;
    });
    idx = 1;
    $('#flight_segments_return').find('div.segment').each(function(){
      if (idx == 1) {
        dates += "Inbound\n";
      }
      dates += "  Depart from " + $('#segment_departureCity_Return' + idx).val() + " at " + $('#segment_departureTime_Return' + idx).val() + "\n";
      dates += "  Arrive in " + $('#segment_arrivalCity_Return' + idx).val() + " at " + $('#segment_arrivalTime_Return' + idx).val() + "\n";
      idx++;
    });

  } else { //generic services
    table.find('tbody td.dates > strong').each(function () {
      dates += $(this).text() + ' | ';
    });
  }
  body = body.replace('[DATE_LIST]', dates);
  return body;
};

copyToAllValuesLinks = function(){
  //Flight dates
  $('#copyToAll').bind('click', function(e){
    e.preventDefault();
    var originRow = $(this).parent().parent(); //The first <tr>
    var selVal = originRow.find('select[name="type[]"] > option:selected').val();
    $('~ tr', originRow).find('select[name="type[]"] > option[value="' + selVal + '"]').prop('selected', true);
    $('~ tr', originRow).find('input[name="net_price[]"]').val(originRow.find('input[name="net_price[]"]').val());
    $('~ tr', originRow).find('input[name="rates[]"]').val(originRow.find('input[name="rates[]"]').val());
    $('~ tr', originRow).find('input[name="stock[]"]').val(originRow.find('input[name="stock[]"]').val());
    $('~ tr', originRow).find('input[name="locator[]"]').val(originRow.find('input[name="locator[]"]').val());
  });

  //Accommodation dates
  $('#copyToAllAccommodations').bind('click', function(e){
    e.preventDefault();
    var originRow = $(this).parent().parent(); //The first <tr>
    /*$('~ tr', originRow).find('input[name="min_capacity[]"]').val(originRow.find('input[name="min_capacity[]"]').val());
    $('~ tr', originRow).find('input[name="max_capacity[]"]').val(originRow.find('input[name="max_capacity[]"]').val());
    $('~ tr', originRow).find('input[name="beds_individual[]"]').val(originRow.find('input[name="beds_individual[]"]').val());
    $('~ tr', originRow).find('input[name="beds_double[]"]').val(originRow.find('input[name="beds_double[]"]').val());
    $('~ tr', originRow).find('input[name="beds_extra[]"]').val(originRow.find('input[name="beds_extra[]"]').val());
    $('~ tr', originRow).find('input[name="restrictions[]"]').val(originRow.find('input[name="restrictions[]"]').val());
    if (originRow.find('input[name="restrictions[]"]').val() != '') {
      $('~ tr', originRow).find('td > span:contains("No")').text('Yes');
      $('~ tr', originRow).find('td > a.ageRestriction').text('edit restriction');
      $('~ tr', originRow).find('td > a.deleteAgeRestriction').show();
    }*/
    $('~ tr', originRow).find('input[name="ac_rates[]"]').val(originRow.find('input[name="ac_rates[]"]').val());
    $('~ tr', originRow).find('input[name="ac_stock[]"]').val(originRow.find('input[name="ac_stock[]"]').val());
  });

  //Guide dates
  $('#copyToAllGuides, #copyToAllTransports, #copyToAllOthers').bind('click', function(e) {
    e.preventDefault();
    var originRow = $(this).parent().parent(); //The first <tr>

    $('~ tr', originRow).find('input[name="sv_rate[]"]').val(originRow.find('input[name="sv_rate[]"]').val());
    $('~ tr', originRow).find('input[name="sv_net_price[]"]').val(originRow.find('input[name="sv_net_price[]"]').val());
    $('~ tr', originRow).find('input[name="sv_stock[]"]').val(originRow.find('input[name="sv_stock[]"]').val());
  });
};


/* GUIDE DATES FORM
 * This functions are also used for the Transport dates and Other dates forms and tables, because
 * the structure is the same. */
initGuideDatesForm = function() {
  var form = $('form');

  setDateSelector(form, 'input[name="service_date[]"]', '#guide_dates_to_selector');

  form.find('.editRow').unbind('click');
  form.find('.editRow').bind('click', function(e){
    e.preventDefault();
    var row = $(this).parent().parent();
    row.find('span').hide();
    row.find('input, select, a.dateSelector, div[class="checker"] > span').fadeIn();
    $(this).hide();
  });

  var addDates = $('#addDates');
  addDates.unbind('click');
  addDates.bind('click', function(e){
    e.preventDefault();
    addGuideRow('');
  });

  deleteRows();

  form.find('.cloneRow').unbind('click');
  form.find('.cloneRow').bind('click', function(e){
    e.preventDefault();
    var row = $(this).parent().parent();
    var tableBody = $('#guideDates').find('table > tbody');
    tableBody.append('<tr>' + row.html() + '</tr>');

    var newrow = tableBody.find('tr:last');
    newrow.find('input.input_date_id').val('');
    newrow.find('input[name="service_date[]"]').val('');
    newrow.find('input[name="sv_rate[]"]').val(row.find('input[name="sv_rate[]"]').val());
    newrow.find('input[name="sv_net_price[]"]').val(row.find('input[name="sv_net_price[]"]').val());
    newrow.find('input[name="sv_stock[]"]').val(row.find('input[name="sv_stock[]"]').val());
    newrow.find('strong').text('');
    newrow.find('span').hide();
    newrow.find('input, select, a.dateSelector').fadeIn();
    newrow.find('a.dateSelector').addClass('btn blue');
    initGuideDatesForm();
  });

  $('.saveDatesAndCalendar').on('click', function(e) {
    e.preventDefault();
    $('#redirectTo').val('calendar');
    form.submit();
  });

  onRequestCheck();
};

addGuideRow = function(copyValuesFrom){
  var tableBody = $('#guideDatesTable');
  if (tableBody.length == 0) {
    tableBody = $('#guideDates').find('table > tbody');
  }
  tableBody.append('<tr>' + $('#sampleRow').html() + '</tr>');
  tableBody.find('tr:last').find('input, select, a.dateSelector, div[class="checker"] > span').slideDown();

  //set html5 validation for price and stock fields
  tableBody.find('tr:last').find('input[name="sv_stock[]"]').attr('required', 'required');
  tableBody.find('tr:last').find('input[name="sv_net_price[]"]').attr('required', 'required');

  if (copyValuesFrom != '') {
    tableBody.find('tr:last').find('input[name="sv_rate[]"]').val(copyValuesFrom.find('input[name="sv_rate[]"]').val());
    tableBody.find('tr:last').find('input[name="sv_net_price[]"]').val(copyValuesFrom.find('input[name="sv_net_price[]"]').val());
    tableBody.find('tr:last').find('input[name="sv_stock[]"]').val(copyValuesFrom.find('input[name="sv_stock[]"]').val());
    tableBody.find('tr:last').find('input[name="on_request[]"]').val(copyValuesFrom.find('input[name="on_request[]"]').val());
    tableBody.find('tr:last').find('input[name="on_request_check[]"]').val(copyValuesFrom.find('input[name="on_request_check[]"]').val());
  } else if (service_type == 'guide') {
    tableBody.find('tr:last').find('input[name="sv_stock[]"]').val(1);
  }
  initGuideDatesForm();
};

updateGuideServicesFromDateSelector = function(){
  if ($('#guide_dates_to_selector').length) {
    updateTableRowsWithDates('#guide_dates_to_selector', '#guideDatesTable');
  }
};

/**
 * addDestinationToService.
 * Function called from the destination selector, that updates the input with the service
 * destinations IDs.
 *
 * @param id int
 * @param name string
 * @param inputId string
 */
function addDestinationToService(id, name, inputId) {
  var type = '';
  if (inputId == '#guideDestinationId') {
    type = 'Guide';
  } else if (inputId == '#transportDestinationId') {
    type = 'Transport'
  } else if (inputId == '#otherDestinationId') {
    type = 'Other'
  }
  if (type != '') {
    var input = $('#service_serviceType' + type + '_destinations');
    addWithComaTo(input, id);

    var newElem = '<p><i class="icon-direction"></i>' + name + '<br/>'
      + '<a href="#' + id + '" class="delDestination">Delete</a></p>';
    input.parent().parent().find('div.tourAssociatedList').append(newElem);
    removeDestinationsLink();
  }
}

/**
 * addWithComaTo.
 * Adds the id to the value of the given input, preceded with a coma if the input is not empty.
 *
 * @param input Element input
 * @param id string
 */
function addWithComaTo(input, id) {
  var val = input.val();
  if (val == '') {
    val = id;
  } else {
    val += ',' + id;
  }
  input.val(val);
}

removeDestinationsLink = function(){
  $('a.delDestination').bind('click', function(e){
    e.preventDefault();
    var id = $(this).attr('href').substring(1);
    var input = $(this).parent().parent().parent().find('input.destRemove');

    addWithComaTo(input, id);

    $(this).parent().remove();
  });
};

/**
 * getValueElement
 * Devuelve el valor del elemento dentro del parent. Comprueba si es un input o span y retorna su valor.
 *
 * @param parent
 * @param element
 * @return
 */
getValueElement = function(parent, element) {
  var elementObj = parent.find(element);
  var valueElement = (elementObj.find('input').length == 1) ? elementObj.find('input').val() :
    elementObj.find('span').text();
  return (isNaN(parseInt(valueElement))) ? 0 : parseInt(valueElement);
};


// dayStatus edit all
initDayStatusEditable = function() {
  $('#dayStatus').show().editable({
    autotext: 'never',
    savenochange: true,
    display: false,
    url: dayStatusEditableUrl,
    ajaxOptions: {
      dataType: 'json' //assuming json response
    },
    success: function (response) {
      if (response.success) {
        $('select[name="on_request\\[\\]"]').each(function (index, element) {
          $(this).val(response.msg.statusId);
          $(this).closest('td').find('span').html(response.msg.statusName);
        });
        App.alert({
          container: $('.message-user'),
          place: 'append',
          // alerts parent container place: 'append', // append or prepent in container type: 'success',
          // alert's type
          type: 'success',
          message: 'All days status has been changed to "' + response.msg.statusName + '"', // alert's message
          close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
          icon: 'fa fa-check'
        });
      } else {
        App.alert({
          container: $('.message-user'),
          place: 'append',
          // alerts parent container place: 'append', // append or prepent in container
          type: 'danger',
          // alert's type
          message: response.msg, // alert's message
          close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
          icon: 'fa fa-times'
        });
      }
    },
    error: function (errors) {
      var msg = '';
      if (errors && errors.responseText) { //ajax error, errors = xhr object
        msg = errors.responseText;
      } else { //validation error (client-side or server-side)
        $.each(errors, function (k, v) {
          msg += k + ": " + v + "<br>";
        });
      }
      App.alert({
        container: $('.message-user'),
        place: 'append',
        // alerts parent container place: 'append', // append or prepent in container
        type: 'danger',
        // alert's type
        message: msg, // alert's message
        close: true, // make alert closable reset: false, // close all previouse alerts first focus: true, // auto scroll to the alert after shown closeInSeconds: 10000, // auto close after defined seconds
        icon: 'fa fa-times'
      });
    }
  });
};
