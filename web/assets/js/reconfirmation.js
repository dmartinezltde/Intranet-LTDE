function initAutocomplete(ajax_route) {
  var filterform = $('form[name="service_filter_extended"]');
  initDestinationAutocomplete(ajax_route, 0, filterform, '#service_filter_extended_destinationId', '.typehead');
}

function initReconfirmationTable() {
  var options = defaultOptions;
  options['columnDefs'] = [
    { "targets": [0],
      "orderable": false,
      "searchable": false
    },
    { "targets": [-1],
      "orderable": false,
      "searchable": false
    }
  ];

  return initDefaultTable('#reconfirmation_table', options);
}


jQuery(document).ready(function() {
  var table = initReconfirmationTable();

  $('#sendReconfirmation').on('click', function(){
    var services = '';
    $('input.serviceCheck:checked', table.fnGetNodes()).each(function(){
      services += $(this).val() + ',';
    });
    $('#services_reconfirm').val(services);
    $('#toReconfirm').submit();
  });

});
