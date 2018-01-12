/**
 * setUpdateContractsTableContainer.
 * Binds the onClick event to the "show" links in the provider table, for contracts. So
 * the called actions executes via ajax and the response is printed in the designated div.
 */
function setUpdateContractsTableContainer() {
  $('a.updateList').bind('click', function(e){
    e.preventDefault();
    var container = $(this).parent().find('div.contracts');
    var preload = ($(this).attr('data-preload') === 'false') ? false : true;

    if ($(this).find('i').hasClass('fa-caret-right')) {
      /**
       * Ajax preload system calls, when called for the first time data-preload property has true value
       * and the second time verifies whether previously called.
       */
      if (!preload) {
        updateFromAjax($(this).attr('href'), '#' + container.attr('id'), false);
        $(this).attr('data-preload', 'true');
      }
      container.slideDown();
      $(this).find('i').removeClass('fa-caret-right');
      $(this).find('i').addClass('fa-caret-down');
      $(this).find('span').text('Hide contracts and services');

    } else {
      container.slideUp();
      $(this).find('i').removeClass('fa-caret-down');
      $(this).find('i').addClass('fa-caret-right');
      $(this).find('span').text('View contracts and services');
    }
  });
}

/**
 * initModalConfirmTexts.
 * Initialization of the messages showns in the modalbox confirmation.
 */
initModalConfirmTexts = function() {
  $('a.deleteprovider').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('The provider is going to be deleted.');
  });

  //To load the content (via ajax) in the modal-body
  $("#create_service_modal").on("show.bs.modal", function(e) {
    var link = $(e.relatedTarget);
    $(this).find(".modal-body").load(link.attr("href"));
  });
  
};
/**
 * initContractsListeners.
 * Initialization of the bindings actions of links.
 */
initContractsListeners = function() {
  setUpdateContractsTableContainer();

  $('#modal-confirm-contract').on('show.bs.modal', function(e) {
    $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
  });
  
  $('#modal-confirm-service').on('show.bs.modal', function(e) {
    $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
  });

  $('a#deleteLogo').bind('click', function(e){
    e.preventDefault();
    $('#provider_removeLogo').val(1);
    $('a#deleteLogo').after('<div class="alert alert-info">The logo will be removed when submitting the form.</div>');
  });

};


initPopovers = function() {
  $('.adminInfo').popover({
    html: true
  });
};

initProviders = function() {
  App.setAssetsPath('/assets/');

  $(document).ajaxSend(function() {
    App.blockUI({
      //target: '#show-blockui',
      boxed: true,
      //animate: true,
      message: 'Processing the request...'
    });
  });
  // unblock when ajax activity stops
  $(document).ajaxStop(function() {
    App.unblockUI();
  });

  $('#provider_mainType').on('change', function() {
    var value = parseInt($(this).val());
    var eleIATA = $('.provider-iata');
    if (value == SERVICE_FLIGHT) {
      eleIATA.fadeIn('slow');
    } else {
      eleIATA.hide();
      eleIATA.find('input').val('');
    }
  });
  $('#provider_mainType').trigger('change');

  $('#toggle-contracts').on('click', function(e) {
    e.preventDefault();

    if ($(this).find('i').hasClass('fa-angle-down')) {
      $(this).attr('data-preload', 'true');
      $(this).find('i').removeClass('fa-angle-down');
      $(this).find('i').addClass('fa-angle-up');
      $(this).find('span').text('Hide all contracts');

    } else {
      $(this).find('i').removeClass('fa-angle-up');
      $(this).find('i').addClass('fa-angle-down');
      $(this).find('span').text('View all contracts');
    }

    var elems = $('a.updateList'), count = elems.length;
    elems.each(function(i) {
      $(this).trigger('click');
    });

  });

};

initFormProvider = function() {
  // Hidden option services
  $('#filterServiceOthers, #filterServiceFlight').hide();

  // Show/Hide options of services dependents of type service
  $('#provider_filter_serviceType').on('change', function (){
    var value = $(this).val();
    if (value == 'Flight') {
      $('#filterServiceOthers').hide();
      $('#filterServiceOthers :input').val('');
      $('#filterServiceFlight').fadeIn();
    } else if (value == '') {
      $('#filterServiceOthers, #filterServiceFlight').hide();
    } else if (value != 'Flight') {
      $('#filterServiceFlight').hide();
      $('#filterServiceFlight :input').val('');
      $('#filterServiceOthers').fadeIn();
    }
  });
  $('#provider_filter_serviceType').trigger('change');

  // Get md5 unique of filter form without changes of values. Only inputs of contracts and services.
  if ($("form[name='provider_filter'] :input").length > 0) {
    var iniStateForm = $.md5($('#filtersShowContract .filter :input').serialize());
    var iniStateServiceFlight = $.md5($('#filterServiceFlight :input').serialize());
    var iniStateServiceOthers = $.md5($('#filterServiceOthers :input').serialize());
  }

  $("form[name='provider_filter']").on('submit', function(e) {
    /* Detects whether filters and service contract have changed their value to show in the post
     * the list of deployed contracts.*/
    var endStateForm = $.md5($('#filtersShowContract .filter :input').serialize());
    var endStateServiceFlight = $.md5($('#filterServiceFlight :input').serialize());
    var endStateServiceOthers = $.md5($('#filterServiceOthers :input').serialize());
    // Check if any filter has changed, before send form
    if ((iniStateForm !== endStateForm) || (iniStateServiceFlight !== endStateServiceFlight)
      || (iniStateServiceOthers !== endStateServiceOthers)) {
      $('#provider_filter_showContracts').val(1);
    } else {
      $('#provider_filter_showContracts').val(0);
    }
  });

};

/**
 * providerSelector.
 * Initializes the selection of providers from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the tour ID in the parent form
 * @param inputName string Selector for the input for the tour name in the parent form
 * @param resourceId int. Assign the selected provider to the resource. This is incompatible with inputId AND inputName (Javi)
 */
function providerSelector(inputId, inputName, addResourcePath) {
  $('table.table').on('click', 'button.select', function(){
    var btn = $(this);
    var name = btn.closest('tr').find('td.dName').text();
    var id = parseInt(btn.attr('data-provider'));

    //Javi added if
    // JAVI TO MODIFY. IT WOULD BE BETTER TO UPDATE THE LIST WITH AJAX INSTEAD OF RELOADING EVERYTHING...
    if (addResourcePath==undefined || addResourcePath==0  ){
      parent.$('#' + inputName).val(name);
      parent.$('#' + inputId).val(id);

      // If exists field contract
      parent.$('#service_contract').val('');
      parent.$('#service_contractId').val('');

      parent.jQuery.fancybox.close();
      parent.setContractsOptions();
    }
    else{
      //JAVI TO DO
      parent.location=addResourcePath.replace('XXX', id);
    }
    
  });
}

/**
 * initAutocomplete.
 * Initializes typehead to search destinations.
 *
 * @param ajax_route string Url to call ajax request to return destinations.
 */
function initAutocomplete(ajax_route) {
  var filterform = $('form[name="provider_filter"]');
  initDestinationAutocomplete(ajax_route, 0, filterform, '#provider_filter_serviceFilter_departureCity', '#provider_filter_serviceFilter_departureCityName');
  initDestinationAutocomplete(ajax_route, 0, filterform, '#provider_filter_serviceFilter_arrivalCity', '#provider_filter_serviceFilter_arrivalCityName');
  initDestinationAutocomplete(ajax_route, 0, filterform, '#provider_filter_serviceFilter_destination', '#provider_filter_serviceFilter_destinationName');
}

initModalConfirmTexts();
initContractsListeners();
initPopovers();
initProviders();
initFormProvider();
