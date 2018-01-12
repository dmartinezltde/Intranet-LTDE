/**
 * updateTableRowsWithDates.
 * Put the dates selected with the dateSelector fancybox as rows in tha dates table.
 *
 * @param datesSelector string Selector for the input when the selected dates are put
 */

function addDatesToTable(datesSelector){
  
  alert("here");
  
  listDates = prepareDayList();
  alert(listDates);
  
  alert(JSON.stringify(parent.listDates));

  hot = parent.hot;
  
  var objs = JSON.parse($(datesSelector).val());
  alert(objs);
  
  return;
  
  var copyValuesFrom = '';
  for (var i in objs) {
    var DatesTable = $(table);

    var inputVal;
    var textVal;
    if (objs[i].dateEnd == '' || objs[i].dateEnd == null) { //There is only one date per obj
      inputVal = objs[i].dateIni;
      textVal = objs[i].dateIni;
    } else { //interval mode
      inputVal = JSON.stringify(objs[i]);
      textVal = objs[i].dateIni + ' to ' + objs[i].dateEnd;
      if (objs[i].days != '' && objs[i].days != null) {
        textVal += ', ';
        objs[i].days.split(',').forEach(function(d){
          textVal += weekDay(d) + ' ';
        });
      }
    }

    var editedInput;
    /* If there is a value in originalValue, means that the user has edited a row, so we must
     * search that input and replace the value. If no originalValue is set, then we can put the
     * value in a new row. */
    if (originalValue != '') {
      editedInput = DatesTable.find('input[value=\'' + originalValue + '\']');
      copyValuesFrom = editedInput.parent().parent();
      originalValue = ''; //controller variable is returned to original state
    } else {
      editedInput = DatesTable.find('tr:not(.sameDateRow) input.dep_date_val[value=""]:last'); //the empty input

      /* Take in count that if the empty input we have found is the one in sampleRow, we can't
       * fill it, so we need to add a row and put the value there. */
      var row = editedInput.parent().parent();
      if (row.attr('id') == 'sampleRow') {
        addRowToTable(datesSelector, copyValuesFrom);

        editedInput = DatesTable.find('tr:not(.sameDateRow) input.dep_date_val[value=""]:last');
      }
    }
    editedInput.val(inputVal);
    editedInput.parent().find('strong').text(textVal);
    editedInput.parent().find('.dateSelector').removeClass('btn blue');

    if (datesSelector == '#flight_dates_to_selector') {
      updateFirstDate(objs[i].dateIni);
    }
  } //end for objs
};