var collectionHolder;

jQuery(document).ready(function() {

  /* Event listener for the select change that display the number of sub-forms indicated. */
  $('#period_multiple_copy_number_copies').bind('change', function(){
    collectionHolder = $('#partials');
    collectionHolder.html('');
    collectionHolder.data('index', collectionHolder.find(':input').length);

    var num = $(this).val();
    for (i=1; i<=num; i++) {
      addTagForm(collectionHolder, i);
    }

    $('.date-picker input').datepicker({
      rtl: App.isRTL(),
      orientation: "right",
      autoclose: true
    }).on('changeDate', function(e) {
      var the_date_arr = $(this).val().split('/');
      var the_date = the_date_arr[2] + '-' + the_date_arr[0] + '-' + the_date_arr[1];
      var partialDiv = $(this).parent().parent().parent();
      var copy_services_div = partialDiv.find('div.copy_services_check');
      copy_services_div.siblings('div.alert').remove();

      $.ajax({
        url: checkServicesUrl.replace('XXX', the_date)
      }).complete(function(data) {
        if (data['responseText'] == '1') {
          copy_services_div.show();
          copy_services_div.find('input').val(1);
        } else {
          copy_services_div.hide();
          copy_services_div.find('input').val(0);
          copy_services_div.find('input').prop('checked', false);
          copy_services_div.after('<div class="alert alert-warning">One or more services are not compatible for this period dates, so can not be assigned, and you will have to do that by hand.</div>');
        }
      });
    });
  });
});

/**
 * addTagForm.
 * This function is used to add a new Form for the collection of forms in the main form, as it is
 * explained in the Symfony documentation. But this function is adapted to the particularities of
 * this case.
 *
 * @param collectionHolder
 * @param num
 */
function addTagForm(collectionHolder, num) {
  var prototype = collectionHolder.data('prototype');
  var index = collectionHolder.data('index');

  // Replace '__name__' in the prototype's HTML to
  // instead be a number based on how many items we have
  var newForm = prototype.replace(/__name__/g, index);

  collectionHolder.data('index', index + 1); // increase the index with one for the next item

  // Display the form in the page in a div at the end of the sub-forms container
  var newFormDiv = $('#partials').append('<h4>Copy ' + i + '</h4>' + newForm);
}

