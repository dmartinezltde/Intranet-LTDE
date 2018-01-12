function manage_num_inbound_segments(value){
  manage_segments("inboundSegments", "inbound", value);
}

function manage_num_outbound_segments(value){
  manage_segments("outboundSegments", "outbound", value);
}

function manage_segments(fieldName, prefix, num_forms){
  // Get the ul that holds the collection of segments
  var $collectionHolder = $('ol.'+fieldName);
  var existing_num_forms = $collectionHolder.find('li').length;
  var num_forms = parseInt(num_forms);
  if (num_forms > existing_num_forms){
    for(var i=0; i<num_forms-existing_num_forms; i++){
      addSegmentForm($collectionHolder, fieldName, prefix);
    }
  }
  else if(num_forms < existing_num_forms){
    for(var i=0; i<existing_num_forms-num_forms; i++){
      $collectionHolder.find("li:last-child").remove();
      $collectionHolder.data('index', $collectionHolder.find('li').length);
    }
  }
}

function initializeSegmentAddition(fieldName, prefix){
  
   
   //var $newLinkLi = $('<li></li>').append($addSegmentLink);
    var $newLinkLi = $('<li></li>');
  
    // Get the ul that holds the collection of segments
   var $collectionHolder = $('ol.'+fieldName);
    
    // add the "add a segment" anchor and li to the segments ul
    //$collectionHolder.append($newLinkLi);
    
    // count the current form inputs we have (e.g. 2), use that as the new
    // index when inserting a new item (e.g. 2)
    $collectionHolder.data('index', $collectionHolder.find('li').length);
    
    /*
    $addSegmentLink.on('click', function(e) {
        // prevent the link from creating a "#" on the URL
        e.preventDefault();
        
        // add a new segment form (see code block below)
        addSegmentForm($collectionHolder, $newLinkLi, fieldName, prefix);
    });*/
}    



jQuery(document).ready(function() {
  
  initializeSegmentAddition('inboundSegments', 'inbound');
  initializeSegmentAddition('outboundSegments', 'outbound');
  
  // handle the removal, just for this example
  $('.remove-segment').click(function(e) {
      e.preventDefault();
        
      $(this).parent().remove();
        
      return false;
  });
    
});

function addSegmentForm($collectionHolder, fieldName, prefix) {
    // Get the data-prototype explained earlier
    var prototype = $collectionHolder.data('prototype');
    
    // get the new index
    var index = $collectionHolder.data('index');
    
    
    // Replace '$$name$$' in the prototype's HTML to
    // instead be a number based on how many items we have
    var newForm = prototype.replace(/__name__/g, index);
    
    // increase the index with one for the next item
    $collectionHolder.data('index', index + 1);
    
    var $newFormLi = $('<li></li>');
    $newFormLi.append(newForm);
    
    $collectionHolder.append($newFormLi);
        
    initNewSegmentForm('', fieldName, "service_"+fieldName+"_"+index);
}


/**
 * initSegmentForm.
 * Initializes the timepickers and autocompletes for the embedded segment forms.
 *
 * @param destination_search string The URL for the ajax call to load the destinations for the autocomplete
 * @param numSeg Number of segments
 * @param type string "Go" or "Return"
 */
initNewSegmentForm = function(destination_search, fieldName, destination_prefix) {
  
  var destination_search = tk_base_url+'admin/destination/posible_parents'; //JAVI. I do not like it here...
  
  initTimePickers();

  var serviceForm = $('form[name="service"]');
  
  //now the initialization of the destination autocompleters for all deperture and arrival cities
  initDestinationAutocomplete(destination_search, 30, serviceForm,
    '#'+destination_prefix+'_departureCityId',
    '#'+destination_prefix+'_departureCity');
  initDestinationAutocomplete(destination_search, 30, serviceForm,
    '#'+destination_prefix+'_arrivalCityId',
    '#'+destination_prefix+'_arrivalCity');
};


initExistingSegments = function(){
    
  var destination_search = tk_base_url+'admin/destination/posible_parents';
  var serviceForm = $('form[name="service"]');
  
  for(i=0; i<20; i++){
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      '#service_outboundSegments_'+i+'_departureCityId',
      '#service_outboundSegments_'+i+'_departureCity');
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      '#service_outboundSegments_'+i+'_arrivalCityId',
      '#service_outboundSegments_'+i+'_arrivalCity');
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      '#service_inboundSegments_'+i+'_departureCityId',
      '#service_inboundSegments_'+i+'_departureCity');
    initDestinationAutocomplete(destination_search, 30, serviceForm,
      '#service_inboundSegments_'+i+'_arrivalCityId',
      '#service_inboundSegments_'+i+'_arrivalCity');
  }
}

flipGoReturn = function(value){
  
  if(value == 1){
    $("#service_numSegmentsReturn").val(0);
    manage_num_inbound_segments(0);
  }
  else if(value == 2){
    $("#service_numSegmentsGo").val(0);
    manage_num_outbound_segments(0);
  }
  
}