/**
 * initBloodhoundDestinations.
 * Initializes the source of the destinations autocompleter.
 *
 * @param route string
 * @param type int
 * @returns {*|e}
 */
function initBloodhoundDestinations(route, type) {
  var destinations = new Bloodhound({
    datumTokenizer: function (destinations) {
      return Bloodhound.tokenizers.whitespace(destinations.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    remote: {
      url: route + '/' + type + '/QUERY',
      wildcard: 'QUERY'
    }
  });
  destinations.initialize();

  return destinations;
}

/**
 * initDestinationAutocomplete.
 * Initializes the selection of the destination ID from the autocompleter.
 *
 * @param route string
 * @param type int
 * @param form Object
 * @param inputIdSelector string
 * @param sourceSelector string The selector for the input where the user types (usually '.typehead')
 * @returns {*|e}
 */
function initDestinationAutocomplete(route, type, form, inputIdSelector, sourceSelector) {
  var destinations = initBloodhoundDestinations(route, type);

  form.find(sourceSelector).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'destinations',
      display: function (destination) {
        form.find(inputIdSelector).val(destination.id);
        return destination.name;
      },
      source: destinations.ttAdapter()
    }).on('typeahead:selected', function (event, obj) {
      form.find(inputIdSelector).val(obj.id);
  });
}

/**
 * initParentform.
 * Initializes the functionaliti to add parent destinations to the actual editind one.
 *
 * @param form_id string
 * @param ajax_route string Route for the autocompleter
 * @param type_id int Parameter for the autocompleter
 */
function initParentform(form_id, ajax_route, type_id) {
  var parentForm = $('#' + form_id).find('div.parentForm');

  parentForm.hide();
  $('a#showAddForm' + form_id).on('click', function (e) {
    e.preventDefault();
    parentForm.slideDown();
  });

  var source = '.typehead';
  if (type_id == 10) {
    source = '#parentCountry';
  } else if (type_id == 20) {
    source = '#parentRegion';
  }
  initDestinationAutocomplete(ajax_route, type_id, parentForm, 'input[name="parentId"]', source);

  //Add the parent
  parentForm.find('button.btn').on('click', function () {
    var inputName = parentForm.find('input[name="parentName"]');
    var inputId = parentForm.find('input[name="parentId"]');
    $('.addDestLabel').remove();

    if (inputId.val() == '') {
      $(this).after('<span class="label label-danger addDestLabel">Destination not found</span>');
      $('.addDestLabel').fadeIn();
    } else {
      var dName = inputName.val();
      var dVal = inputId.val();
      var the_li = '<li class="list-group-item">' + dName
        + ' <a href="#"><i class="fa fa-trash"></i></a>'
        + '<input type="hidden" name="parents[' + dVal + ']" value="' + dVal + '" />'
        + '</li>';
      parentForm.closest('.parents').find('ul.list-group').append(the_li);

      //clear values
      inputName.val('');
      inputId.val('');
    }
  });
}

/**
 * initEditForm.
 *
 * @param ajax_route string with the URL to call the autocompleter
 */
function initEditForm(ajax_route) {
  initParentform('countryParents', ajax_route, 10); //type country
  initParentform('regionParents', ajax_route, 20); //type region

  //Delete parents
  $('.parents').find('ul.list-group').on('click','li.list-group-item a', function (e) {
    console.log('enter');
    e.preventDefault();
    $(this).closest('li').remove();
    $('div.note').slideDown();
  });
}

/**
 * destinationSelector.
 * Initializes the selection of destinations from the modal to the parent form.
 *
 * @param inputId string The selector for the input containing the destination ID in the parent form
 * @param inputName string Selector for the input for the destination name in the parent form
 * @param returnPath
 */
function destinationSelector(inputId, inputName, returnPath) {
  
  $('table.table').on('click', 'button.select', function(){
    var btn = $(this);
    var name = btn.closest('tr').find('td.dName').text();
    var parts = btn.attr('id').split('_');
    var id = parts[1];
    
    parent.$(inputName).val(name);
    parent.$(inputId).val(id);

    /* Special cases when using the selector in some situations.
     * #cityDepId is used to add a departure city for a tour.
     * #tourDestinationId is used to add a destination for a tour.
     */
    if (inputId == '#cityDepId') {
      updateFromAjax(returnPath.replace('XX', id), '#departureCities', true, false);
    } else if (inputId == '#tourDestinationId') {
      updateFromAjax(returnPath.replace('XX', id), '#destinations', true, false);
    } else if (inputId == '#itinerary_day_destinationId') {
      parent.updateVisitCities(id, name);
    } else if (inputId == 'destinationId') {
      parent.addEntityToModalMultipleSelectorField("service_destinations", id, name);
    }

    parent.jQuery.fancybox.close();
  });
}