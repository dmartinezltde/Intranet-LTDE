/**
 * eventClickFunc.
 * Capture the event click in fullcalendar and show the modalbox with date edition.
 *
 * @param calEvent
 * @param jsEvent
 * @param view
 */
eventClickFunc = function(calEvent, jsEvent, view) {
  var dateType = calEvent.dateType;
  var dateId = calEvent.dateId;
  var url = dateEdit.replace('XX', dateId);
    
  var theModal = $('#editModal');
  theModal.find('.modal-dialog > .modal-content').load(url, function(){
    theModal.modal();
    initEdit();
  });
};

dayClickFunc = function(date, jsEvent, view, resourceObj) {
  var Ymd = date.getFullYear() + '-' + (date.getMonth() +1) + '-' + date.getDate();
  var url = dateEdit;
  

  url += '?d=' + Ymd + '&sid=' + subServiceId;

  var theModal = $('#editModal');
  theModal.find('.modal-dialog > .modal-content').load(url, function(){
    theModal.modal();
    initEdit();
  });
};

/**
 * initEdit.
 * This sets the form inside the modal to submit to the action defined in the form itself. In the
 * controller specifies if return the html (in case of error) or redirect the browser (in case of
 * success).
 */
function initEdit() {
  var editForm = $('#editForm');
  editForm.on('submit', function(e){
    e.preventDefault();
    $.post(editForm.attr('action'), editForm.serialize(), function(data, status, xhr) {
      if (data == 'OK') { //this means that the response is correct and need to reload parent page
        location.reload(true);
        //TODO: reload the page in the same month the user vas viewing
      } else {
        $('#editModal').find('div.modal-content').html(data);
      }
    });
  });
}


jQuery(document).ready(function () {
  /* Calendar initialization.
   * See http://fullcalendar.io/docs */
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    firstDay: 1,
    editable: false,
    events: events,
    eventClick: eventClickFunc,
    dayClick: dayClickFunc
  });

});