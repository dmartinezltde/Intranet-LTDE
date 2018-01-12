jQuery(document).ready(function () {
  tinymce.init({
    mode: "textareas",
    theme: "modern",
    editor_selector: "wysiwyg"
  });

  initCopyReservationComments();
  initAddRowButtons();
  initCopyTemplate();
  initSaveRowButtons();
  initChangeReservationMode();

  // "Save without sending" button
  $('#only_save').on('click', function () {
    $('input[name="save"]').val(1);
    $('#rooming_send').submit();
  });

  $('.seecomments').on('click', function(e) {
    e.preventDefault();
    var txt = $(this).attr('data-int') + "\n"
      + $(this).attr('data-acc') + "\n"
      + $(this).attr('data-tra') + "\n";
    alert(txt);
  });
});

/**
 * initCopyReservationComments.
 * Initializes the copy of text (values) between same inputs data-roles of reservation comments.
 */
function initCopyReservationComments() {
  $('input.accommodation_comment').on('blur', function(){
    var txt = $(this).val();
    var input_id = $(this).attr('data-role');

    $('input.accommodation_comment').each(function () {
      $('input[data-role="' + input_id + '"]').val(txt);
    });
  });
}

/**
 * initAddRowButtons.
 * And a new extra row for a rooming list.
 * Increments the "extra rows" counter.
 */
function initAddRowButtons() {
  $('button.add_row').on('click', function (e) {
    e.preventDefault();

    var tr = $(this).parent().parent();
    var extra_count = tr.find('input.extra_rows_count');
    var extra_num = extra_count.val();
    extra_num++;

    var sdid = tr.find('input.service_date_id').val();

    var url = Routing.generate('provider_rooming_list_extra_row',
      { id: period_id, service_date_id: sdid, n: extra_num });

    $.ajax({
      url: url,
      method: 'GET',
      async: true
    }).complete(function(data) {
      tr.before(data.responseText);
      extra_count.val(extra_num);

      initSaveRowButtons();
    });
  });
}

/**
 * initSaveRowButtons.
 * Set the save flag for the row to 1. This also means that totals for the same reservation modes
 * will be increased.
 */
function initSaveRowButtons() {
  // SAVE button
  var sve_btn = $('button.save_row');
  sve_btn.off('click');
  sve_btn.on('click', function () {
    var row = $(this).parent().parent();

    var row_saved_input = row.find('input.row_saved');
    row_saved_input.val(1);
    row.find('input, select').prop('readonly', 'readonly');
    row.find('button.save_row').hide();
    row.find('button.delete_row').show();

    //Increase totals, use the ServiceDate.id to identify the totals for this rooming
    var sd_id = row.find('input.service_date_id').val();
    var rm_id = row.find('select.reservation_mode').val();

    var option_txt = row.find('select.reservation_mode').find('option[value=' + rm_id + ']').text();
    increaseTotal(sd_id, rm_id, option_txt);
  });

  // DELETE button
  var del_btn = $('button.delete_row');
  del_btn.off('click');
  del_btn.on('click', function () {
    var row = $(this).parent().parent();

    //Decrease totals
    var sd_id = row.find('input.service_date_id').val();
    var rm_id = row.find('select.reservation_mode').val();

    decreaseTotal(sd_id, rm_id);

    /* If a previously saved extra row is deleted, it must be kept in constance to remove from the
     * DB if the form is submited. To do that we put the extra rows ID's in a hidden input. Only the
     * saved rows have an id attribute. */
    var attr_id = $(this).attr('id');
    if (typeof attr_id !== typeof undefined && attr_id !== false) {
      var id_parts = attr_id.split('_');
      var delrows = $('#delrows');
      var newval = (delrows.val() == '') ? id_parts[1] : delrows.val() + ',' + id_parts[1];
      delrows.val(newval);
    }

    row.detach(); //Remove row
  });
}

/**
 * increaseTotal.
 * Increments in one the reservation mode count for the table.
 * Also increments the total rooms and pax.
 *
 * @param sd_id int ServiceDate ID
 * @param rm_id int ReservationMode ID
 * @param option_txt string ReservationMode name Used to create a new row in the totals table
 */
function increaseTotal(sd_id, rm_id, option_txt) {
  var total_rm = $('#totals_' + sd_id + '_rm_' + rm_id);
  if (total_rm.length == 0) {
    var new_room_type_row = '<tr><td>Total "' + option_txt + '"</td>'
      + '<td id="totals_' + sd_id + '_rm_' + rm_id + '">1</td></tr>';
    $('#total_rooms_row_' + sd_id).before($(new_room_type_row));
  } else {
    total_rm.text(parseInt(total_rm.text()) + 1);
  }

  var total_rooms = $('#totals_' + sd_id + '_rooms');
  total_rooms.text(parseInt(total_rooms.text()) +1);

  var total_pax = $('#totals_' + sd_id + '_pax');
  total_pax.text(parseInt(total_pax.text()) +1);
}

/**
 * decreaseTotal.
 * Substract one unity fom the totals table of the ServiceDate, for the ReservationMode.
 * Rest one to the rooms and pax totals.
 *
 * @param sd_id int ServiceDate ID
 * @param rm_id int ReservationMode ID
 */
function decreaseTotal(sd_id, rm_id) {
  var total_rm = $('#totals_' + sd_id + '_rm_' + rm_id);
  total_rm.text(parseInt(total_rm.text()) -1);

  var total_rooms = $('#totals_' + sd_id + '_rooms');
  total_rooms.text(parseInt(total_rooms.text()) -1);

  var total_pax = $('#totals_' + sd_id + '_pax');
  total_pax.text(parseInt(total_pax.text()) -1);
}

/**
 * initCopyTemplate.
 * Action for the copy from template button.
 */
function initCopyTemplate() {
  $('#template').on('click', function () {
    // Copy the extra rows
    clearExtraRows(); // First clear the previously added rows from roomings
    $(this).parent().parent().prevAll('.extra_row').each(function() {
      // To clone the tr and the inputs with values we must "touch" them
      $(this).find('input').each(function() {
        $(this).attr('value', $(this).val());
      });
      // The same for the selected options
      $(this).find('select > option').each(function(){
        $(this).attr('selected', $(this).prop('selected'));
      });

      var name = $(this).find('input.row_saved').attr('name');
      var pox = name.lastIndexOf('[');
      var e_count = name.substr(pox);
      e_count = e_count.substr(1, (e_count.length -2));
      var content = $(this).clone().html();
      addRowToRoomings(content, e_count);
    });

    // Copy the reservation modes
    copyReservationModes();

    // Copy the totals table
    var table = $(this).parent().parent().prev().find('table.totals_table').html();
    overwriteTotalsTables(table);

    //Copy rows comments
    copyAccommodationComments();
    copyMealComments();

    // Copy the servideDate comments
    var comment = $(this).parent().parent().prev().find('textarea').val();
    copyComments(comment);

    initSaveRowButtons();
  });
}

/**
 * addRowToRoomings.
 * Iterate over all addRow buttons and add the content before that tr.
 *
 * @param content string with the html of the row
 * @param e_count int The number (id) of the extra row to add
 */
function addRowToRoomings(content, e_count) {
  $('button.add_row').each(function() {
    var sdid = $(this).parent().find('input.service_date_id').val();

    /* Check the ServiceDate ID to not add the row to the template itself, and also checks that rows
     * with the same ID are already added. */
    if (sdid != 'T0' && $('input[name="name[' + sdid + '][' + e_count + ']"]').length == 0) {
      //before inserting the content ServiceDate id "T0" must be replaced with the rooming id
      var new_content = '<tr class="extra_row">' + content.replace(/T0/g, sdid) + '</tr>';

      $(this).parent().parent().before(new_content);

      var count = $(this).parent().parent().find('input.extra_rows_count');
      count.val(parseInt(count.val()) +1);
    }
  });
}

/**
 * clearExtraRows.
 * Remove from the roomings (not the template) all extra rows previously added. We have to simulate
 * the click in the trash icon in order to put the data in the hidden input to delete on post.
 */
function clearExtraRows() {
  $('button.delete_row').each(function() {
    var sdid = $(this).parent().find('input.service_date_id').val();
    if (sdid != 'T0') {
      $(this).click();
    }
  });
}

function overwriteTotalsTables(content) {
  $('table.totals_table').each(function() {
    var sdid = $(this).parent().parent().prev().find('input.service_date_id').val();
    if (sdid != 'T0') {
      var new_content = content.replace(/T0/g, sdid);
      $(this).html(new_content);
    }
  });
}

/**
 * copyComments.
 * Set the given text to all service_date_comment of the page.
 *
 * @param txt string
 */
function copyComments(txt) {
  $('textarea.service_date_comment').val(txt);
}

/**
 * copyAccommodationComments.
 * Takes the values from the accommodation_comment inputs of the template and copies them to the
 * other roomings.
 */
function copyAccommodationComments() {
  $('td.template input.accommodation_comment').each(function() {
    var txt = $(this).val();
    var name = $(this).attr('name'); // is like "accommodation_comment[T0_<reservation_id>]"
    var parts = name.split('_');

    $('input[name^="accommodation_comment"][name$="' + parts[2] + '"]').val(txt);
  });
}

/**
 * copyMealComments.
 * Copy each meal comment for the travelers in the template to the other roomings.
 */
function copyMealComments() {
  $('td.template input.meal_comment').each(function() {
    var txt = $(this).val();
    var trav_id = $(this).attr('data-role');

    $('input[data-role="' + trav_id + '"]').val(txt);
  });
}

/**
 * initChangeReservationMode.
 * When a reservation mode select changes, need to update the rooming counts.
 */
function initChangeReservationMode() {
  // Need to keep the original value to modify the totals
  $('select.reservation_mode').on('focus', function() {
    $(this).attr('oldVal', $(this).val());
  });

  $('select.reservation_mode').on('change', function() {
    var row = $(this).parent().parent();
    var sd_id = row.find('input.service_date_id').val();
    console.log('SD id: ' + sd_id);

    var rm_old = $(this).attr('oldVal');
    decreaseTotal(sd_id, rm_old);

    var rm_id = $(this).val();
    var rm_name = $(this).find('option:selected').text();
    increaseTotal(sd_id, rm_id, rm_name);

    /* Take on the focus from the select, in order to get the correct old value the next time it
     * changes. We do this because if the select is changed multiple times without focusing out, the
     * oldVal is alwais the first. */
    $(this).focus();
  });
}

/**
 * copyReservationModes.
 * Set the selects for the reservation modes in the roomings with the same value that the ones in
 * the template.
 */
function copyReservationModes() {
  $('tr.template_row').find('select.reservation_mode').each(function() {
    var rm_val = $(this).val();
    var name = $(this).attr('name');

    $('input.service_date_id').each(function() {
      var sdid = $(this).val();
      var sel = $('select[name="' + name.replace(/T0/g, sdid) + '"]');
      sel.val(rm_val);
      sel.find('option[value="' + rm_val + '"]').prop('selected');
    });

  });
}