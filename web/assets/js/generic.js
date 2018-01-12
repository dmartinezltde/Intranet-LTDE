/**
 * updateFromAjax.
 * This function calls the passed URL and updates de parent document DOM puting the results of the
 * ajax call inside the indicated element.
 *
 * @param url string
 * @param selector string
 * @param inParent bool If true the response is updated in the parent document
 * @param async bool If true the response is asyncronous
 */
function updateFromAjax(url, selector, inParent, async) {
  async = (typeof async !== 'undefined') ?  async : true;

  $.ajax({
    url: url,
    async: async
  }).complete(function(data) {
    if (inParent) {
      $(selector, parent.document).html(data['responseText']);   // JAVI. THERE IS A PROBLEM HERE... THE DATA IS LOADED LATER...
    } else {
      $(selector).html(data['responseText']);
    }
    //In some cases we have to rebind some event listeners for the new content

    //JAVI TO FINISH MIGRATION. This is not needed any more
    /*
    if (selector == '#departureCities' || selector == '#destinations') {
      //initDelDestinations(); // JAVI COMMENTED... I DO NOT GET THAT
      alert("here");
      initDelDestinations();
    } else if (selector == '#tags') {
      initDelTags(inParent); // JAVI DOUBT. Why is this not working when closing the modal?  // JAVI COMMENTED... I DO NOT GET THAT
    } else */ 
    if (strncmp(selector, '#itineraries_', 13) == 0) {
     initPeriodListeners(); // JAVI COMMENTED... I DO NOT GET THAT
    }
    if (strncmp(selector, "#contracts_", 11) == 0) {
      initModalConfirmTexts();  //JAVI. I do not like it...
    }
    if (typeof initRetailerDeleteModal !== 'undefined') {
      initRetailerDeleteModal();
    }

  }).error(function(jqXHR, textStatus, errorThrown){
    if (inParent) {
      /* This is to solve an error that makes the ajax call stalled in the browser. The call is
       * executed properly but the response is not loading, so reloading the parent page makes the
       * changes visible. */
      parent.location.reload(true);
    }
  });
}

/**
 * selectPhotoForTour.
 * Reload the selected tour photos in the parent window and closes the fancybox.
 *
 * @param url string
 */
function selectPhotoForTour(url) {
  updateFromAjax(url, '#photoList', true);
}

function updateRequirementsForTour(url, partialSelector) {
  updateFromAjax(url, '#' + partialSelector + 'List', true);
}

/**
 * strncmp.
 * http://phpjs.org/functions/strncmp/
 *
 * @param str1 string
 * @param str2 string
 * @param lgth int
 * @returns int
 */
function strncmp(str1, str2, lgth) {
  var s1 = (str1 + '').substr(0, lgth);
  var s2 = (str2 + '').substr(0, lgth);

  return ((s1 == s2) ? 0 : ((s1 > s2) ? 1 : -1));
}

/**
 * initDelDestinations.
 * Initialization of the events to remove departures and destinations fron a tour.
 */
initDelDestinations = function() {
  //$('a.delDestination').bind('click', function(e){   // JAVI REPLACED FROM bind TO on
  //$(document).on("click", '.delDestination', function(e){ // DANI REPLACED FROM $(div) TO $(document)
  $(document).on("click", '.delDestination', function(e){
    e.preventDefault();
    var url = $(e.target).attr('href');
    var div = $(e.target).closest('div.tourTextList');
    updateFromAjax(url, '#' + div.attr('id'), false);
  });
};

/**
 * initDelTags.
 * Initialization of the events for the links of "delete tags" in the tour edition tag list.
 *
 * @param inParent bool If it's true means that the tag list is in the parent window that fired this
 */
initDelTags = function(inParent) {
  var sel;
  if (inParent) {
    sel = $(parent.document);
  } else {
    sel = $(document);
  }
  //sel.bind('click', function(e){     // JAVI REPLACED FROM bind TO on. Changed to use deletegated binding
  sel.on('click', '.delTag', function(e){
    e.preventDefault();
    var url = $(e.target).attr('href');
    var div = $(e.target).closest('div.tourTextList');
    updateFromAjax(url, '#tags', inParent);
    
    if (inParent) {
      parent.jQuery.fancybox.close();
    }
  });
};

var initFilterReservations = function () {
  $('#selectReservationStatus').on('change', function() {
    var valueEncrypted = $(this).val();
    var splited = valueEncrypted.split(':');
    var action = splited[0];
    var value = splited[1];
    
    var reservations = $('a[is-reservation=1]');
    for(i = 0; i < reservations.length; i++) {
      var reservation = $(reservations[i]);
      var valueThis = reservation.attr('reservation-' + action);
      if(valueThis == value || value == 'all') {
        reservation.parent().parent().show();
      } else {
        reservation.parent().parent().hide();
      }
    }
  });
};

initFilterReservations();

var handleTimePickers = function () {
  if (jQuery().timepicker) {
    initTimePickers();

    // handle input group button click
    $('.timepicker').parent('.input-group').on('click', '.input-group-btn', function(e){
      e.preventDefault();
      $(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
    });
  }
};

initDatepickers = function() {
  if (jQuery().datepicker) {
    $('.date-picker').datepicker({
      rtl: App.isRTL(),
      autoclose: true,
      format: 'yyyy-mm-dd',
      weekStart: 1
    });
    //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
  }
};

initTimePickers = function() {
  $('.timepicker-default').timepicker({
    autoclose: true,
    minuteStep: 1,
    showSeconds: false,
    showMeridian: false,
    defaultTime: '00:00'
  });
};

$('#modal-confirm').on('show.bs.modal', function(e) {
  $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
});

$('.fancyModal').fancybox({
  type: 'iframe',
  width: 800,
  minWidth: 500,
  height: 'auto',
  minHeight: 200,
  maxHeight: 600,
  beforeShow: function() {
    $('.fancybox-overlay.fancybox-overlay-fixed').css('display', '')
  },
  cyclic: false
});

$('.fancyModalClose').bind('click', function(){
  parent.jQuery.fancybox.close();
});


//JAVI//To load the content (via ajax) in the modal-body... Is it correct?
$("#generic_modal").on("show.bs.modal", function(e) {
  var link = $(e.relatedTarget);
  $(this).find(".modal-body").load(link.attr("href"));
});

//JAVI
/**
 * genericSelector.
 * Initializes the selection of instances from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the field ID in the parent form
 * @param inputName string Selector for the input for the field name in the parent form
 * @param redirectUrl. This is incompatible with inputId and inputName. Redirects to the url
 */
function genericSelector(inputId, inputName, actionPath, multiple) {
          
  $('table.table').on('click', 'button.select', function(){
    
    var btn = $(this);
    var name = btn.closest('tr').find('td').eq(0).text().trim(); // JAVI TO DECIDE
    var id = parseInt(btn.attr('data-instance'));
    
    if (multiple!=undefined && multiple!="undefined") {
      parent.addEntityToModalMultipleSelectorField(inputId, id, name);
      parent.jQuery.fancybox.close();
    }
    else if (actionPath==undefined || actionPath==0){
      parent.$('#' + inputName).val(name);
      parent.$('#' + inputId).val(id);

      parent.jQuery.fancybox.close();
    }
    else{
      parent.location=actionPath.replace('XXX', id);
    }
  });

}


/**
 * tourSelector.
 * Initializes the selection of tours from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the tour ID in the parent form
 * @param inputName string Selector for the input for the tour name in the parent form
 * @param returnPath string
 * @param parentReferer string
 */
 /*
function tourSelector(inputId, inputName, returnPath, parentReferer) {
  $('table.table').on('click', 'button.select', function() {
    var btn = $(this);
    var name = btn.closest('tr').find('td.dName').text();
    var id = parseInt(btn.attr('data-tour'));

    if (parentReferer) {
      parent.$('#' + inputName).val(name);
      parent.$('#' + inputId).val(id);
      parent.jQuery.fancybox.close();
    } else {
      // Only for debug
      $('#' + inputName).val(name);
      $('#' + inputId).val(id);      
    }
  });
}*/


/**
 * initBloodhoundGeneric.
 * Initializes the source of any field autocompleter.
 *
 * @param route string
 * @param type int
 * @returns {*|e}
 */
function initBloodhound(route) {
  var found_elements = new Bloodhound({
    datumTokenizer: function (found_elements) {
      return Bloodhound.tokenizers.whitespace(found_elements.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
      url: route + '/QUERY',
      wildcard: 'QUERY'
    }
  });
  found_elements.initialize();

  return found_elements;
}

var countResults = function (context) {
    if(context.suggestions.length >= 5) {
      return "<div style='text-align:center'>There are more results</div>";
    } else {
      return;
    }
}

function genericAutocomplete(route, formName, inputIdSelector, sourceSelector){
    
  var found_elements = initBloodhound(route);
  
  var form = $('form[name="'+formName+'"]');
  
  form.find(sourceSelector).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'destinations',
      display: function (found_element) {
        form.find(inputIdSelector).val(found_element.id);
        return found_element.name;
      },
      source: found_elements.ttAdapter(),
      extraVars:Handlebars.registerHelper("numResults",function(){
          return (  "more" );
      }),
      templates: {
          header:countResults
      }
    }).on('typeahead:selected', function (event, obj) {
      form.find(inputIdSelector).val(obj.id);
  });
}


//JAVI ADDED
//THIS FUNCTION MAKES SELECTORS NOT WORKING
// JAVI TO CORRECT

/*
function initBatchEditableTable(){
  $(document).ready(function() {
        $('.editable-column-link').editable();
  });
}

initBatchEditableTable();
*/  
  
//JAVI ADDED  
function replicate_value_on_column(val, field){
    if( val==null ){  return;  }
    $("input[id*="+field+"]").each(function (i, el) {
        $(this).val(val);
     });
}


//JAVI ADDED
function flip_div_display_by_class(value, className, fast){
  if (fast == undefined){
    $('.'+className).fadeOut();
    $("."+className+"_"+(value)).fadeIn();
  }
  else{
    $('.'+className).hide();
    $("."+className+"_"+(value)).show();
  }
}

//JAVI ADDED
function update_selector(button, query_url, selector_id){
  updateFromAjax(query_url, '#'+selector_id, true, false);
  //button.parent.jQuery.fancybox.close();
  parent.jQuery.fancybox.close();
}


//JAVI ADDED
/**
 * addWithComaTo.
 * Adds the id to the value of the given input, preceded with a coma if the input is not empty.
 *
 * @param input Element input
 * @param id string
 */
function addWithComaTo(input, id) {
  var val = input.val();
  if (val == '') {
    val = id;
  } else {
    val += ',' + id;
  }
  input.val(val);
}

//JAVI ADDED
/**
 * addEntityToModalMultipleSelector.
 * Function called from the destination selector, that updates the input with the service
 * destinations IDs.
 *
 * @param id int
 * @param name string
 * @param inputId string
 */
function addEntityToModalMultipleSelectorField(prefix, id, name) {

  var input = $("#"+prefix+"Id");
  addWithComaTo(input, id);
  
  var newElem = '<p id="'+prefix+'_'+id+'"><i class="icon-direction"></i>' + name + '<br/>'
      + '<a href="javascript: removeEntityFromModalMultipleSelectorField(\'' + prefix +'\',' + id + ');">Delete</a></p>';
  
  input.parent().find('div.tourAssociatedList').append(newElem);
  
  $("#"+prefix+"MultipleSelector").append(newElem);

}

/**
 * addEntityToModalMultipleSelector.
 * Function called from the destination selector, that updates the input with the service
 * destinations IDs.
 *
 * @param id int
 * @param name string
 * @param inputId string
 */
function removeEntityFromModalMultipleSelectorField(prefix, id) {

  var input = $("#"+prefix+"Id");
  //var new_value = input.val().replace(id, "").replace(",,",",");
  var xploded = input.val().split(",");
  for(i = 0; i < xploded.length; i++) {
    if(id == xploded[i]){
      xploded.splice(i, 1);
    }
  }
  if(xploded.length > 0) {
    var new_value = xploded.join();
  } else {
    var new_value = "";
  }
  
  input.val(new_value);
  
  $('#'+prefix+'_'+id).remove();
  
}


/**
 * changeActionPagination
 * Function called to submit a form changing the pagination
 *
 */
function changeFormPaginationAction(form, difference, absolute_value) {

  if (form.attr('action')==undefined) {
    var currentPagination = extractUrlValue('page', location.href);
    var found = true;
    if (currentPagination==undefined) {
      currentPagination = 1;
      found = false;
    }
    
    if (difference!=undefined) {
      currentPagination = parseInt(currentPagination) + difference;
    }
    else if (absolute_value!=undefined) {
      currentPagination = absolute_value;
    }
    
    if (currentPagination<1) {
      currentPagination = 1;
    }
    
    new_location = location.href;
    if (found) {
      new_location = new_location.replace(/page=\d+/, 'page='+currentPagination);
    }
    else {
      var join_character = "?";
      if (new_location.indexOf('?')>-1) {
        join_character = "&";
      }
      new_location = new_location + join_character + "page="+currentPagination;
    }
    form.attr('action', new_location);
  }
  form.submit();
  
}


/**
 * Function to get the value of a url parameter
 *
 * @param key String. Name of the paramer to look for
 * @param url String. url
 */
function extractUrlValue(key, url)
{
  if (typeof(url) === 'undefined')
      url = window.location.href;
  var match = url.match('[?&]' + key + '=([^&]+)');
  return match ? match[1] : null;
}


/**
 * changeFormSortedColumn
 * Function called to submit a form changing the sorted column
 *
 */
function changeFormSortedColumnAction(form, order_by, order_type) {

  if (form.attr('action')==undefined) {
      
    var currentSortedColumn = extractUrlValue('order_by', location.href);
    var currentSortTypeColumn = extractUrlValue('order_type', location.href);
    
    new_location = location.href;

    var join_character = "?";
    if (new_location.indexOf('?')>-1) {
      join_character = "&";
    }

    if (currentSortedColumn==undefined) {
      new_location = new_location + join_character + "order_by="+order_by;
    }
    else {
      new_location = new_location.replace(/order_by=\w+/, 'order_by='+order_by);
    }
    
    
    var join_character = "?";
    if (new_location.indexOf('?')>-1) {
      join_character = "&";
    }
        
    if (currentSortTypeColumn==undefined) {
      new_location = new_location + join_character + "order_type="+order_type;
    }
    else {
      new_location = new_location.replace(/order_type=\w+/, 'order_type='+order_type);
    }
        
    form.attr('action', new_location);
  }
  
  form.submit();
  
}

$('.copyClipboard').on('click', function() {
  copyToClipboard($(this).attr('data-message'));
});

function copyToClipboard(elementClass) {
  var content = '';
  $('.' + elementClass).each(function() {
    content = content + $(this).html();
  });
  element = $('<textarea>').appendTo('body').val(content).select();
  document.execCommand("copy");
  element.remove();
}

/**
 * updateFieldFromAjax.
 * This function updates a specific entity field using ajax
 *
 * @param id integer. Entity ID
 * @param class path prefix
 * @param class string. Field name
 * @param field string. Entity attribute
 */
function updateFieldFromAjax(entity_id, url, field_name, value) {
  async =  true;
  
  $.ajax({
      type: "POST",
      url: url,
      dataType: "html",
      data: { field: field_name,
              value: value} ,
      async: true,
    }).success(function(data) {
      $(".div_"+entity_id).html(data);
    }).complete(function(data) {
      //alert(data);
    }).error(function(data) {
      alert("There was an error saving the data. The last changes were not saved.");
    });
  
  return;
  
}