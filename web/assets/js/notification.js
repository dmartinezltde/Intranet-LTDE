//To keep the original expiration days for the alarm when page is loaded
var original_expiration;

/**
 * Function to control the expiration change of an existing alarm. If it changes, the user must
 * decide what to do with old notifications.
 */
var initExpirationChange = function() {
  var alarm_expiration = $('#alarm_expiration');
  var expiration_options_div = $('#expiration_change_actions');
  var oldNotis_select = $('#alarm_oldNotifications');
  original_expiration = alarm_expiration.val();

  //Show the old notifications options in the form
  alarm_expiration.on('change', function(){
    selectValue('#alarm_oldNotifications', 1, true); //Delete notifications
    expiration_options_div.slideDown();
  });

  /* Event for the "what to do with old notifications" select. If cancel the operations return the
   * expiration days to the original value, and hide this control. */
  oldNotis_select.on('change', function(){
    if ($(this).val() == 0) { //cancel
      alarm_expiration.val(original_expiration);
      expiration_options_div.slideUp();
      selectValue('#alarm_oldNotifications', 0, false);
    }
  });
};

/**
 * selectValue.
 * Set the select option of the select identified by the selector param to the value.
 *
 * @param selector string
 * @param value mixed
 * @param setRequired IF true the attribute required is added to the select, if not it's removed
 */
function selectValue(selector, value, setRequired) {
  var select = $(selector);

  select.find('option[selected="selected"]').removeAttr('selected');
  select.val(value);
  select.find('option[value="' + value + '"]').attr('selected', 'selected');

  if (setRequired) {
    select.attr('required', 'required');
  } else {
    select.removeAttr('required');
  }
}

/**
 * alarmTypeChange.
 * Show the fields related with the selected alarm type, and hide the non-related ones.
 * Then fires the event to set the visibility in the current state.
 */
var alarmTypeChange = function() {
  var alarmType = $('#alarm_type');
  alarmType.on('change', function(){
    var limit = $('#alarm_inferiorLimit');
    var stock = $('#alarm_stockDecrease');

    if ($(this).val() == 1) { //inferior limit
      limit.parent().parent().show();
      stock.parent().parent().hide();
    } else {
      limit.parent().parent().show();
      stock.parent().parent().show();
    }
  });

  alarmType.change();
};

/**
 * showHideContractTypeFilter.
 * Depending on the value selected in the type filter, show or hide a group of contract related
 * input filters.
 */
var showHideContractTypeFilter = function() {
  var contract_type_filters = $('#contract_type_filters');

  if ($('#notification_filter_type').val() == 1) { //type contract
    contract_type_filters.slideDown();
  } else {
    contract_type_filters.fadeOut();
    contract_type_filters.find('input').val(''); //Clear fields
  }
};

var notificationPortletSwitch = function() {
  $('.seeNotifications').on('click', function() {
    
    $('.seeNotifications.notificationWarningDiv')
      .removeClass('notificationWarningDiv')
      .addClass('notificationSuccessDiv');
      
    $(this).removeClass('notificationSuccessDiv')
      .addClass('notificationWarningDiv');
      
    switchAjaxCall($(this).attr('id'));
    
  });
};

var applyFilters = function() {
  $('#reloadActual').on('click', function(event) {
    event.preventDefault();
    var actual = $('.seeNotifications.notificationWarningDiv');
    switchAjaxCall(actual.attr('id'));
  });
};

var initDefaultNotifications = function(defaultId) {
  $('#' + defaultId).removeClass('notificationSuccessDiv')
      .addClass('notificationWarningDiv');
  switchAjaxCall(defaultId);
};

var switchAjaxCall = function(id) {
  var filters = dynamicFilter();
  $.ajax({
    type: 'POST',
    url: Routing.generate('notifications_switch', { type : id } ),
    data: filters,
    beforeSend: function() {
      $('#notificationsContainer').parent().parent().parent().show();
      $('#alertNotifications').hide();
      $('#notificationsContainer').html('<div class="row">'
        + '<div class="col-md-12" style="text-align:center;">'
          + '<b>Loading content, please wait</b>'
          + '</div></div>');
    },
    success: function(response) {
      $('#notificationsContainer').html(response);
    }
  });
};

var dynamicFilter = function() {
  var user = $('#notification_filter_user').val();
  var priority = $('#notification_filter_priority').val();
  var status = $('#notification_filter_status').val();
  var type = $('#notification_filter_type').val();
  return { user : user, priority : priority, status : status, type : type };
};

/**
 * initAddComment.
 * Adds the listener for the "add comment" to the notification list.
 */
var initAddComment = function () {
  $('a.add_comment').off('click');
  $('a.add_comment').on('click', function(e) {
    e.preventDefault();

    var txt = $(this).parent().find('textarea');
    $(this).hide();
    txt.show();

    initCommentSave(txt);
  });

  $('textarea.comment:visible').each(function() {
    initCommentSave($(this));
  });
};

/**
 * initCommentSave.
 * Sets the event for the blur to save the content of the textarea.
 *
 * @param input object
 */
var initCommentSave = function (input) {
  input.on('blur', function() {
    var id = input.attr('id').split('_');
    var url = Routing.generate('notification_save_comment', { id: id[1] });

    $.ajax({
      url: url,
      method: 'POST',
      data: {'comment': input.val()}
    }).complete(function(data) {
    });
  });
};

jQuery(document).ready(function () {
  alarmTypeChange();
  notificationPortletSwitch();
  applyFilters();

  // Initialize only on the notifications page
  if ($('#notificationsContainer').length > 0) {
    /* Initialize by default type "TODAY" */
    initDefaultNotifications('not_today');
  }

  showHideContractTypeFilter();
  $('#notification_filter_type').on('change', function(e){
    showHideContractTypeFilter();
    initAddComment();
  });
  initDatepickers();
});
