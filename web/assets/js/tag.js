/**
 * tagSelector.
 * Creates an event on the select buttons of the tag list, to add the selected tag to the tour via
 * ajax.
 *
 * @param returnPath string The URL to call to add the tag in DB
 */
function tagSelector(returnPath) {
  $('table.table').on('click', 'button.select', function(){
    var btn = $(this);
    var parts = btn.attr('id').split('_');
    var id = parts[1];
    var url = returnPath.replace('XX', id);
    //javi: added syncronous update from ajax to avoid refresh problems in parent.
    updateFromAjax(url, '#tags', true, false);
    parent.jQuery.fancybox.close();
  });
}