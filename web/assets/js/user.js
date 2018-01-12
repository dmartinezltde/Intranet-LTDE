/**
 * userSelector.
 *
 * @param inputId string The selector for the input containing the user ID in the parent form
 * @param inputName string Selector for the input for the username in the parent form
 * @param returnPath string
 */
function userSelector(inputId, inputName, returnPath) {
  $('table.table').on('click', 'button.select', function(){
    var btn = $(this);
    var name = btn.closest('tr').find('td.uName').text();
    var parts = btn.attr('id').split('_');
    var id = parts[1];

    parent.$(inputName).val(name);
    parent.$(inputId).val(id);

    var url = returnPath.replace('XX', id);
    //javi: made it syncronous to avoid parent refreix problems
    updateFromAjax(url, '#assignedUsers', true, false); 

    parent.jQuery.fancybox.close();
  });
}
