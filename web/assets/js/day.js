3// Maintain array of dates
var dates = new Array();

/**
 * hashCode.
 * Generate a hash of the input value
 *
 */
String.prototype.hashCode = function () {
  var hash = 0, i, chr, len;
  if (this.length === 0) {
    return hash;
  }
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// Takes a 1-digit number and inserts a zero before it
function padNumber(number) {
  var ret = new String(number);
  if (ret.length == 1) {
    ret = "0" + ret;
  }
  return ret;
}

initItineraryDayForm = function (autocompleteUrl, typeLimit) {
  var form = $('form[name="itinerary_day"]');
  initDestinationAutocomplete(autocompleteUrl, typeLimit, form, '#itinerary_day_cityHotel', '#itinerary_day_cityHotelName');
  initDestinationAutocomplete(autocompleteUrl, typeLimit, form, '#itinerary_day_cityFlightOrigin', '#itinerary_day_flightOriginName');
  initDestinationAutocomplete(autocompleteUrl, typeLimit, form, '#itinerary_day_cityFlightDestination', '#itinerary_day_flightDestinationName');

  //A way to clear the IDs for flight arrival and departure inputs when the user erases the content
  $('#itinerary_day_flightOriginName').on('blur', function(e){
    if ($(this).val() == '') {
      $('#itinerary_day_cityFlightOrigin').val('');
    }
  });
  $('#itinerary_day_flightDestinationName').on('blur', function(e){
    if ($(this).val() == '') {
      $('#itinerary_day_cityFlightDestination').val('');
    }
  });

  //Remove the cities to visit
  $('a.delVisitCity').bind('click', function(e){
    e.preventDefault();
    var citiesVisitedIds = $('#itinerary_day_citiesVisitedIds');
    var id = $(this).attr('href').substr(1);
    var newval = citiesVisitedIds.val().replace(id, '');
    citiesVisitedIds.val(newval);
    $('#cv' + id).remove();
  });
};

/**
 * updateVisitCities.
 *
 * @param id int
 * @param name string
 */
updateVisitCities = function(id, name){
  var input_ids = $('#itinerary_day_citiesVisitedIds');
  var newval = (input_ids.val() == '') ? id : (',' + id);
  input_ids.val(input_ids.val() + newval);
  $('#citiesVisit').append('<p id="cv' + id + '">' + name + '<br/><a href="#' + id + '" class="delVisitCity">Delete</a></p>');
};

initDayForm = function (autocompleteUrl, typeLimit) {
  var form = $('form[name="day"]');
  initDestinationAutocomplete(autocompleteUrl, typeLimit, form, '#day_night', '#day_nightName');
  initDestinationAutocomplete(autocompleteUrl, typeLimit, form, '#day_destination', '#day_destinationName');
};

/**
 * ComponentsDateTimePickers.
 * Date picker object which adds days or intervals in a list for selection.
 */
var ComponentsDateTimePickers = function () {
  var listDates = [];
  var stringDaysOfWeek = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var showInterval = 1;
  var inputReturn = '';
  var dayList = 0;

  // Init datepicker days
  $('button.add-days').attr('disabled', 'disabled');
  var handleDatePickersDays = function () {
    $('.date-picker-days').datepicker({
      format: 'yyyy-mm-dd',
      orientation: "right",
      startDate: moment().format('YYYY-MM-DD'),
      multidate: true,
      todayHighlight: true,
      weekStart: 1,
      toggleActive: true
    }).on('changeDate', function(e){
      if (e.dates.length > 0) {
        $('button.add-days').removeAttr('disabled');
      } else {
        $('button.add-days').attr('disabled', 'disabled');
      }
    });
  };

  var setStatusButton = function() {
    var iniDate = $('#dates_filter_iniDate').val();
    var endDate = $('#dates_filter_endDate').val();
    if (iniDate && endDate) {
      $('button.add-interval').removeAttr('disabled');
    } else {
      $('button.add-interval').attr('disabled', 'disabled');
    }
  };

  // Init datepicker of dates intervals
  $('button.add-interval').attr('disabled', 'disabled');
  var handleDatePickersInterval = function () {

    $('#dates_filter_iniDate').datepicker({
      format: 'yyyy-mm-dd',
      orientation: "right",
      startDate: moment().format('YYYY-MM-DD'),
      todayHighlight: true,
      weekStart: 1,
      autoclose: true
    }).on('changeDate', function(e){
      setStatusButton();
      $('#dates_filter_endDate').datepicker('setStartDate', $(this).val());
    });

    $('#dates_filter_endDate').datepicker({
      format: 'yyyy-mm-dd',
      orientation: "right",
      startDate: moment().format('YYYY-MM-DD'),
      todayHighlight: true,
      weekStart: 1,
      autoclose: true
    }).on('changeDate', function(e){
      setStatusButton();
    });
  };

  // Init call action buttons
  var handleAddActionsButtons = function () {
    // Add day or multiple days to the list of dates
    $('.add-days').bind('click', function () {
      var dp_days = $('.date-picker-days');
      var listDates = dp_days.datepicker('getFormattedDate');
      var dates = listDates.split(',');
      _.each(dates, function (item) {
        if (item !== '') {
          addDateOrInterval('day', item);
        }
      });
      // Show dates list
      showDates();
      // Empty datepicker
      dp_days.datepicker('update', '');
    });

    // Add interval to the list of dates
    $('.add-interval').bind('click', function () {
      var iniDate = $('#dates_filter_iniDate').val();
      var endDate = $('#dates_filter_endDate').val();
      var daysWeek = getDaysWeek();

      if (iniDate && endDate) {
        addDateOrInterval('interval', iniDate, endDate, daysWeek);
        showDates();
        clearDateInterval();
      }
    });

    // Select all days or intervals of the list of dates
    $('.check-all').on('click', function () {
      $('.check-date').attr('checked', 'ckecked');
    });

    // All days of week of interval
    $('#dates_filter_daysWeek_0').on('click', function () {
      var dayWeek = $('.day-week');
      if ($(this).is(':checked')) {
        dayWeek.parent().addClass('checked');
        dayWeek.prop('checked', true).uniform('refresh');
      } else {
        dayWeek.parent().removeClass('checked');
        dayWeek.prop('checked', false).uniform('refresh');
      }
    });

    // All days of week of interval
    $('#check-all').on('click', function () {
      var checkDate = $('.check-date');
      if ($(this).is(':checked')) {
        checkDate.parent().addClass('checked');
        checkDate.prop('checked', true).uniform('refresh');
      } else {
        checkDate.parent().removeClass('checked');
        checkDate.prop('checked', false).uniform('refresh');
      }
    });

    $('#submit-dates').on('click', function () {
      
      // If isset dayList, return only dates, not intervals
      if (dayList) {
        listDates = prepareDayList();
      }
            
      //alert(JSON.stringify(listDates));

      //parent.$('#' + inputReturn).val(JSON.stringify(listDates));

      //hot = parent.hot;      
      
      data_to_insert = [];
      
      for (i in listDates){
        for (row_block_index in parent.empty_new_dates){
          var new_date = listDates[i];
          
          /*Modify the handsontable_data instead of using alter('insert_row')
           * as a trick to avoid the addition of new rows when dragging */
          parent.handsontable_data.push([]);
          //parent.hot.alter('insert_row', null);
          parent.row_instance_ids.push(-1);
          parent.new_dates_json[parent.hot.countRows()-1] = new_date;
          if (new_date.dateEnd != undefined){
            data_to_insert.push([parent.hot.countRows()-1, 0, new_date.intervalTxt]);
          }
          else{
            data_to_insert.push([parent.hot.countRows()-1, 1, new_date.dateIni]);
          }
          for (col_key in parent.empty_new_dates[row_block_index]){
            data_to_insert.push([parent.hot.countRows()-1, parseInt(col_key), parent.empty_new_dates[row_block_index][col_key]]);
          }
          //{"hash":306359143,"dateIni":"2017-01-26","dateEnd":null,"days":null,"timestamp":1485385200000,"intervalTxt":"2017-01-26"}
        }
      }
      
      parent.hot.setDataAtCell(data_to_insert);
      
      //alert(data_to_insert);
  
      parent.jQuery.fancybox.close();
    });

    $('#remove-dates').on('click', function () {
      $('.check-date').each(function () {
        if ($(this).is(':checked')) {
          removeDateOrInterval($(this).val());
        }
      });
      // Unchecked all dates
      $('#check-all').prop('checked', false).uniform('refresh');
    });

    $('#dates_filter_typeDate_0').on('click', function() {
      if ($(this).is(':checked')) {
        $('.block-intervals').fadeOut();
        $('.block-days').slideDown();
      } else {
        $('.block-days').fadeOut();
        $('.block-intervals').slideDown();
      }
    });

    $('#dates_filter_typeDate_1').on('click', function() {
      if ($(this).is(':checked')) {
        $('.block-days').hide();
        $('.block-intervals').slideDown();
      } else {
        $('.block-intervals').fadeOut();
        $('.block-days').slideDown();
      }
    });
  };

  var getDaysWeek = function () {
    var allVals = [];
    $('.days-week :checked').each(function () {
      if ($(this).val() > 0) {
        allVals.push(parseInt($(this).val()));
      }
    });

    return (_.size(allVals)) ? allVals.join(',') : null;
  };

  var initListDates = function () {
    var html;
    // Order dates
    listDates = _.sortBy(listDates, 'timestamp');

    var tplDate = "<tr><td><input type=\"checkbox\" id=\"<%= hash %>\" class=\"check-date\" "
                + "name=\"date[<%= hash %>]\" value=\"<%= hash %>\" /><%= dateString %></td></tr>";
    var compiled = _.template(tplDate);
    if (_.size(listDates)) {
      _.each(listDates, function (i) {
        html += compiled({hash: i.hash, dateString: getDateString(i)});
      })
    } else {
      html = "<tr><td class=\"text-center\" >No introduced dates</td></tr>";
    }
    $('#list-dates').find('table tbody').html(html);

    // Important! Is need to refresh the checkboxes features initialized by the plugin uniform js
    App.initUniform();
  };

  var getDateString = function (i) {
    var txtDays = [];
    var dateString = moment(i.dateIni, "YYYY-MM-DD").format('YYYY-MM-DD');

    if (!_.isNull(i.dateEnd)) {
      dateString = 'From ' + dateString;
      dateString += ' to ' + moment(i.dateEnd, "YYYY-MM-DD").format('YYYY-MM-DD');
    }

    // Tractament of number days to string
    if (!_.isNull(i.days)) {
      var daysOfWeek = i.days.split(',');
      if (daysOfWeek) {
        if (_.size(daysOfWeek) == 7) {
          dateString += ', all days';
        } else {
          _.each(daysOfWeek, function (i, key) {
            txtDays[key] = stringDaysOfWeek[i];
          });
          dateString += ', ' + txtDays.join(', ');
        }
      }
    }
    return dateString;
  };

  var addDateOrInterval = function (type, dateIni, dateEnd, days) {
    var hash = '';
    if (type == 'interval') {
      hash = dateIni.hashCode() + dateEnd.hashCode();
    } else {
      hash = dateIni.hashCode();
      dateEnd = days = null;
    }
    var item = {
      'hash': hash,
      'dateIni': dateIni,
      'dateEnd': dateEnd,
      'days': days,
      'timestamp': parseInt(moment(dateIni, "YYYY-MM-DD").format('x'))
    };
    item["intervalTxt"] = getDateString(item);
    if (_.size(listDates) > 0) {
      var keyExists = false;
      _.each(listDates, function (i) {
        if (_.propertyOf(i)('hash') == hash) {
          keyExists = true;
          return false;
        }
      });
      if (!keyExists) {
        listDates.push(item);
      }
    } else {
      listDates.push(item);
    }
  };

  var prepareDayList = function() {
    var newListDates = [];
    _.each(listDates, function (i) {
      var dateEnd = _.propertyOf(i)('dateEnd');
      if (moment(dateEnd, 'YYYY-MM-DD').isValid()) {
        var dateIni = _.propertyOf(i)('dateIni');
        // Convert string to array of numbers
        var daysOfWeek = _.propertyOf(i)('days');
        if (!_.isUndefined(daysOfWeek) && !_.isNull(daysOfWeek)) {
         var days = daysOfWeek.split(',').map(function(item) {
            return parseInt(item, 10);
          });
        }
        // Range of dates
        var range = moment.range(moment(dateIni, 'YYYY-MM-DD'), moment(dateEnd, 'YYYY-MM-DD'));
        range.by('days', function(day) {
          var dateIni = day.format('YYYY-MM-DD');
          var item = {'hash': dateIni.hashCode(), 'dateIni': dateIni, 'dateEnd': null, 'days': null,
            'timestamp': parseInt(moment(dateIni, "YYYY-MM-DD").format('x'))};
          if (_.isArray(days)) {
            if (_.contains(days, parseInt(day.format('YYYY-MM-DD')))) {
              newListDates.push(item);
            }
          } else {
            newListDates.push(item);
          }
        });
      } else {
        newListDates.push(i);
      }
    });
    return newListDates;
  };

  var removeDateOrInterval = function (element) {
    var index = _.findIndex(listDates, {'hash': parseInt(element)});
    if (index > -1) {
      listDates.splice(index, 1);
      $('#' + element).closest('tr').remove();
    }
  };

  var clearDateInterval = function () {
    $('#dates_filter_iniDate').val('');
    $('#dates_filter_endDate').val('');
    /*$('.days-week :checked').each(function () {
      $(this).parent().removeClass('checked');
      $(this).removeAttr('checked');
    });*/
    $('button.add-interval').attr('disabled', 'disabled');
  };

  var showDates = function () {
    initListDates();
  };

  var hideDateIntervals = function () {
    if (!showInterval) {
      $('#container-intervals').hide();
    }
    // Hide block, while we select the appropriate option.
    $('.block-days').hide();
    $('.block-intervals').hide();
  };

  var loadIntervals = function () {
    var inputRetParent = parent.$('#' + inputReturn);
    if (inputRetParent.length > 0 && inputRetParent.val() != '') {
      listDates = JSON.parse(inputRetParent.val());
    }
  };

  return {
    //main function to initiate the module
    init: function (input, interval, list) {
      // Init variables
      inputReturn = input; //Element where put response parent
      showInterval = interval; // If show interval block
      dayList = list; // Return all single days of intervals.

      // Init functions
      hideDateIntervals();
      handleDatePickersDays();
      handleDatePickersInterval();
      handleAddActionsButtons();

      // Check if exists dates or intervals to edit. Fill in list container
      loadIntervals();
      // List dates or intervals.
      initListDates();
    }
  };

}();

/**
 * dayTypeChange.
 * Initialization of the day type select to fill the activities if we are in a creation.
 */
dayTypeChange = function () {
  $('#itinerary_day_dayType').bind('change', function(){
    var activities = $('table.activities tbody tr');
    if (activities.length > 0) {
      alert('Warning! You are changing the day type, but this day has activities defined, so no new activities for this day will be created.');
    }
  });
};

$(document).ready(function () {
  $('#copyNight').bind('click', function (e) {
    e.preventDefault();
    $('#day_destinationName').val($('#day_nightName').val());
    $('#day_destination').val($('#day_night').val());

    $('#itinerary_day_destinationName').val($('#itinerary_day_nightName').val());
    $('#itinerary_day_destination').val($('#itinerary_day_night').val());
  });

  dayTypeChange();
});
