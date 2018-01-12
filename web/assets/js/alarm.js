// Object Alarms
var alarms = function () {

  // Variable to hold request
  var request;

  // Close fancy modal
  var closeFancyBox = function () {
    jQuery.fancybox.close();
  }

  /**
   * initModalConfirmTexts.
   * Initialization of the messages showns in the modalbox confirmation for the reservation mode
   * configuration.
   */
  var initModalConfirmTexts = function () {
    $('#delete-user').bind('click', function () {
      $('#modal-confirm').find('div.modal-body').html('The bed configuration is going to be deleted.');
    });
  };
  
  var initInputChange = function () {
    $('#number_full').on('change', function() {
      var url = $('#number_full').attr('data-url');
      $.ajax({
        type: 'POST',
        url: url,
        data: {value: $('#number_full').val(), field: 'daysFull'},
        success: function(r) {
          $('#number_full_txt').html(r);
          $('#number_full_txt').show().delay(5000).fadeOut();
        }
      });
    });
    
    $('#number_deposit_first').on('change', function() {
      var url = $('#number_deposit_first').attr('data-url');
      $.ajax({
        type: 'POST',
        url: url,
        data: {value: $('#number_deposit_first').val(), field: 'daysDepositFirst'},
        success: function(r) {
          $('#number_deposit_first_txt').html(r);
          $('#number_deposit_first_txt').show().delay(5000).fadeOut();
        }
      });
    });
    
    $('#number_deposit_final').on('change', function() {
      var url = $('#number_deposit_final').attr('data-url');
      $.ajax({
        type: 'POST',
        url: url,
        data: {value: $('#number_deposit_final').val(), field: 'daysDepositFinal'},
        success: function(r) {
          $('#number_deposit_final_txt').html(r);
          $('#number_deposit_final_txt').show().delay(5000).fadeOut();
        }
      });
    });
  };

  /**
   * providerSelector.
   * Initializes the selection of providers from the modal to the parent form.
   */
  // Init call action buttons
  var handleAddActionsButtons = function () {
    $('button.select-user').on('click', function (event) {
      event.preventDefault();
      var btn = $(this);
      var name = btn.closest('tr').find('td.dName').text();
      var id = parseInt(btn.attr('data-user'));
      $('#userId').val(id);
      saveUser(event);
    });

    $('button.select-profile').on('click', function (event) {
      event.preventDefault();
      var btn = $(this);
      var name = btn.closest('tr').find('td.pName').text();
      var id = parseInt(btn.attr('data-profile'));
      $('#profileId').val(id);
      saveProfile(event);
    });
  };

  /**
   * saveUser.
   * Asign user to alarm. Sends the data via ajax
   */
  var saveUser = function (event) {
    // Prevent default posting of form
    event.preventDefault();

    var data = [];

    // Abort any pending request
    if (request) {
      request.abort();
    }

    // setup some local variables
    var $form = $('#frmSelectorUser');

    // Let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");

    // Get all name=value of hidden fields to past
    $form.find(".hidden").each(function () {
      var valueInput = $(this).val();
      var nameInput = $(this).attr('name');
      data.push(nameInput + "=" + valueInput);
    });

    var serializedData = data.join("&");

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request
    request = $.ajax({
      url: $form.attr('data-url'),
      type: "post",
      data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR) {
      parent.$($form.attr('data-container')).html(response);
      parent.jQuery.fancybox.close();
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      console.error("The following error occurred: " + textStatus, errorThrown);
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
      // Reenable the inputs
      $inputs.prop("disabled", false);
    });
  };

  /**
   * saveProfile.
   */
  var saveProfile = function (event) {
    // Prevent default posting of form
    event.preventDefault();

    var data = [];
    if (request) {
      request.abort(); // Abort any pending request
    }

    var $form = $('#frmSelectorProfile'); // setup some local variables
    var $inputs = $form.find("input, select, button, textarea"); //select and cache all the fields

    // Get all name=value of hidden fields to past
    $form.find(".hidden").each(function () {
      var valueInput = $(this).val();
      var nameInput = $(this).attr('name');
      data.push(nameInput + "=" + valueInput);
    });

    var serializedData = data.join("&");

    // Let's disable the inputs for the duration of the Ajax request.
    // Note: we disable elements AFTER the form data has been serialized.
    // Disabled form elements will not be serialized.
    $inputs.prop("disabled", true);

    // Fire off the request
    request = $.ajax({
      url: $form.attr('data-url'),
      type: "post",
      data: serializedData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR) {
      parent.$($form.attr('data-container')).html(response);
      parent.jQuery.fancybox.close();
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown) {
      console.error("The following error occurred: " + textStatus, errorThrown);
    });

    // Callback handler that will be called regardless if the request failed or succeeded
    request.always(function () {
      $inputs.prop("disabled", false); // Reenable the inputs
    });
  };

  return {
    // Main init methods to initialize the layout
    init: function () {
      initModalConfirmTexts();
      handleAddActionsButtons();
      initInputChange();
    }
  };
}();

// Init app
jQuery(document).ready(function () {
  alarms.init();
});