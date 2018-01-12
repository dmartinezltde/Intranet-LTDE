var instance_prefix = "retailer";

function updateInfoValues(prefix){
  
  url_prefix = instance_prefix+"_"+prefix;
  
  var baseUrl = undefined;
  
  switch(prefix){
    case "comission":
      baseUrl = base_url_retailer_comission;
      break;
    case "nextComission":
      baseUrl = base_url_retailer_comission;
      break;
    case "coefficient":
      baseUrl = base_url_retailer_coefficient;
      break;
    case "nextCoefficient":
      baseUrl = base_url_retailer_coefficient;
      break;
  }
  
  var selected=$("#"+url_prefix).find(":selected");
  var selectedValue = selected.val();
  
  var title_suffix = "";
  
  /* Detect if the selected value is inherited from the group or the monetary date range */
  if (selectedValue==""){
    if (instance_prefix=="retailer"){
      var retailerGroup=$("#retailer_retailerGroup").find(":selected");
      if (retailerGroup!=undefined){
        selectedValue = retailerGroup.attr("data-"+prefix+"_id");
        info_title = retailerGroup.attr("data-"+prefix+"_name");
        info_title += " (Inherited from the retailer group "+retailerGroup.attr("data-name")+")";
      }
    }
    if (instance_prefix=="retailer_group"){
      var currentMonetaryRange = $("#"+instance_prefix+"_"+prefix.replace("next","").toLowerCase()).find(":selected");
      if (currentMonetaryRange!=undefined){
        selectedValue = currentMonetaryRange.attr("data-next_id");
        if (currentMonetaryRange.attr("data-next-name")==undefined){
          info_title = "There is not current "+prefix.replace("next","").toLowerCase();
        }
        else{
          info_title = currentMonetaryRange.attr("data-next_name");
          info_title += " (Default next "+prefix.replace("next","").toLowerCase()+" for "+currentMonetaryRange.attr("data-name")+")";
        }
      }
    }
  }
  else{
    var retailerGroup = undefined;
    info_title = selected.html();
  }
  
  if (baseUrl!=undefined){
    $.ajax({
      type: "POST",
      url: baseUrl.replace("XXX", selectedValue),
      data: {"id": $(this).value},
      dataType: "html",
      async: false,
    }).complete(function(data) {
      $("#"+url_prefix+"_info_div").find(".block").html(info_title);
      $("#"+url_prefix+"_info_div").find("p").html(data['responseText']);
    }).error(function(data) {
      //$("#"+url_prefix+"_info_div").find("p").html("There was a problem loading the data.");
      $("#"+url_prefix+"_info_div").find("p").html("There was a problem loading the data. Probably there is no information in the database to be shown.");
    });
  }
  else{
    if (retailerGroup != undefined && (selected.val()==undefined || selected.val()=="")){
      $("#"+url_prefix+"_info_div").fadeIn();
      $("#"+url_prefix+"_info_div").find(".block").html(info_title);
      $("#"+url_prefix+"_info_div").find("p").html();
    }
    else{
      $("#"+url_prefix+"_info_div").fadeOut();
    }
  }
}


function updateAllInfoValues(){
  
  updateInfoValues("comission");
  updateInfoValues("nextComission");
  updateInfoValues("coefficient");
  updateInfoValues("nextCoefficient");
  updateInfoValues("rate");
  updateInfoValues("nextRate");
  updateInfoValues("priceChangeNotification");
  updateInfoValues("stockEndNotification");
  updateInfoValues("flightChangeNotification");
  
}

var initGroupDeleteModal = function() {
  $('a.retailer_group_delete').bind('click', function () {
    $('#modal-confirm').find('div.modal-body').html('The retailer group will be deleted. Are you sure?');
  });
};

/**
 * initRetailerDeleteModal.
 * Initialization of the events for the delete links of the retailers table. The moda-confirm set of
 * the link also needs to be initilized because of the ajax loading.
 */
var initRetailerDeleteModal = function() {
  $('a.retailer_delete').bind('click', function () {
    $('#modal-confirm').find('div.modal-body').html('The retailer will be deleted. Are you sure?');
  });

  $('#modal-confirm').on('show.bs.modal', function(e) {
    $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
  });
};

jQuery(document).ready(function() {
  initGroupDeleteModal();
});

var urlGetId = function() {
  var pathname = window.location.pathname;
  var path = pathname.split("/");
  var count = path.length;
  if(path[count-2] == "edit") {
    return path[count-1];
  } else {
    return false;
  }
}

var initButtons = function() {
  
  var id = urlGetId();
  
  if(id) {
    baseUrl = base_url_history_rate;
    baseUrl = baseUrl.replace("XXX", id);
    $('#retailer_group_rate').parent().parent().parent().append('<a href="'+baseUrl+'" class="btn btn-success" style="margin-bottom:10px">See history of Rates for this Retailer');
    
    baseUrl = base_url_history_coefficient;
    baseUrl = baseUrl.replace("XXX", id);
    $('#retailer_group_coefficient_info_div').parent().parent().append('<a href="'+baseUrl+'" class="btn btn-success" style="margin-bottom:10px">See history of Coefficients for this Retailer');
    
    baseUrl = base_url_history_comission;
    baseUrl = baseUrl.replace("XXX", id);
    $('#retailer_group_comission_info_div').parent().parent().append('<a href="'+baseUrl+'" class="btn btn-success" style="margin-bottom:10px">See history of Comissions for this Retailer');  
  }
}
