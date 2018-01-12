/**
 * initModalConfirmTexts.
 * Initialization of the messages showns in the modalbox confirmation for the reservation mode 
 * configuration.
 */
initModalConfirmTexts = function () {
  $('#delete-bed-configuration').bind('click', function () {
    $('#modal-confirm').find('div.modal-body').html('The bed configuration is going to be deleted.');
  });
};

// Object Reservation Mode
var reservationMode = function () {
    
  var enableBlockUI = function (el) {
    App.blockUI({target: el, boxed: true});
  }
  
  var disableBlockUI = function (el) {
    App.unblockUI(el);
  }

  var refreshBedConfiguration = function (el, path) {
    enableBlockUI(el);
    closeFancyBox();
    updateFromAjax(path, el, true);
  }
 
  var closeFancyBox = function() {
    jQuery.fancybox.close();  
  }

  return {
    // Main init methods to initialize the layout
    init: function () {
      this.setAssetsPath();
    },
    setAssetsPath: function () {
      App.setAssetsPath('/assets/');
    },
    refresh: function (el, path) {
      refreshBedConfiguration(el, path);
    }
  };
}();


jQuery(document).ready(function () {
  // Important to see images on the assets of application
  initModalConfirmTexts();
  reservationMode.init();
});
    