
/**
 * initContractForm.
 *
 * @param providerSearch string URL for the providers autocomplete
 */
initContractForm = function(providerSearch) {
  initProvidersAutocomplete(providerSearch, $('form[name="contract"]'), '#contract_providerId', '#contract_provider');

  $('#contract_provider').bind('blur', function(){
    if ($(this).val() == '') {
      $('#contract_providerId').val('');
      $('#contract_provider').val('');
    } else {
      setContractsOptions();
    }
  });

  //Change the modal confirmation message depending on the link class
  $('a.del_alarm').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('You are about to remove the alarm. Are you sure?');
  });
  $('a.del_alarm_and_notis').bind('click', function(){
    $('#modal-confirm').find('div.modal-body').html('This alarm has notifications associated to it. To delete the alarm and all its notifications, click Continue.');
  });
};

/**
 * contractSelector.
 * Initializes the selection of contracts from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the tour ID in the parent form
 * @param inputName string Selector for the input for the tour name in the parent form
 * @param parentInputName string Selector for the input parend that depends this element
 */
function contractSelector(inputId, inputName, parentInputName) {
  $('table.table').on('click', 'button.select', function(){
    var btn = $(this);
    var name = btn.closest('tr').find('td.dName').text();
    var id = parseInt(btn.attr('data-contract'));

    parent.$('#' + inputName).val(name);
    parent.$('#' + inputId).val(id);
    if (parentInputName != '') {
      var provider = btn.attr('data-provider') || '';
      parent.$('#' + parentInputName).val(provider);
    }

    parent.jQuery.fancybox.close();
  });
}