jQuery(document).ready(function () {
  initFilterForm();
  initProjectionTextSave();
});

function initFilterForm() {
  $('#filter_projections').on('submit', function(e) {
    e.preventDefault();

    filterByTour();
    filterByPeriod();
    filterByProjectionMS();
    hideTours();

    return false;
  });
}

/**
 * filterByTour.
 * Hide the period divs that doesn't have the same name that the input in the filter.
 */
function filterByTour() {
  var name = $('#tour_name').val();
  if (name != '') {
    $('div.tour').each(function() {
      if ($(this).attr('data-role') == name) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } else { //show all tours
    $('div.tour').show();
  }
}

/**
 * filterByPeriod.
 * Gets the name from the filter form and check against div.period elements.
 */
function filterByPeriod() {
  var name = $('#period_name').val();

  if (name != '') {
    $('div.period').each(function () {
      if ($(this).attr('data-role') == name) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } else { //show all periods
    $('div.period').show();
  }
}

/**
 * filterByProjectionMS.
 * Show or hide the table tr rows with less value in data-role attribute than the selected in the
 * filter.
 */
function filterByProjectionMS() {
  var pms = $('#projected_missed_sales').val();

  if (pms != '' && pms > 0) {
    $('tr.activity').each(function() {
      var trval = parseInt($(this).attr('data-role'));

      if (trval >= pms) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } else { //show all
    $('tr.activity').show();
  }
}

/**
 * hideTours.
 * Check if all periods for a tour are hidden, and in that case hides the tour div.
 */
function hideTours() {
  if ($('#tour_name').val() == '') {
    $('div.tour').show(); //show all tours
  }
  $('div.tour').each(function() {
    if ($('div.period:visible', this).length == 0) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
}

/**
 * initProjectionTextSave.
 * Sets the listener to the inputs and make an ajax call to update the activity field.
 */
  function initProjectionTextSave() {
  $('input.projection_text').on('blur', function () {
    var id = $(this).attr('id');
    console.log(id);
    var parts = id.split('_');
    var activity_id = parts[1];
    var url = Routing.generate('activity_save_projection_text', { id: activity_id });
    var new_text = $(this).val();
    $.ajax({
      url: url,
      method: 'POST',
      data: { text: new_text },
      async: true
    }).complete(function(data) {
      //update all fields with the same activity ID
      $('input#projectionText_' + activity_id).val(new_text);
    });
  });
}