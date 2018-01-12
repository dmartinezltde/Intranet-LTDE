function updateCampaignFormLabels() {
  
  var campaign_type=$("#campaign_monetaryDateRangeTypeStr").val();
  
  var clabel = "";
  
  var valueType = $("#campaign_valueType").val();
  
  if (campaign_type==1){
    clabel = "PVP: Discount";
    if (valueType==1){
      clabel += ' (%)';
    }
    else{
      clabel += ' (€)';
    }
  }
  else if (campaign_type==2){
    clabel = "Comission: Percentage variation";
  }
  else {
    clabel = "Comission: Fix comission";
  }
  
  $("#monetaryDateRangeTypeStrDependantLabel").html(clabel);

}



function selectAll(value){
  $('.all').prop('checked', value);
  
  if(value==false){
    $('.all_false').prop('checked', value);
  }
  
  if(value==true){
    $(".period").fadeOut();
  }
  
  $.uniform.update(); //Necessary because of metronic theme. Otherwise it does not update the view
}

function selectSpecificTour(tour_value, periods_value, tour_id){
  
  $("#product_selector_all").prop('checked', false);
  
  if(tour_value==false){
    $(".tour_"+tour_id).prop('checked', tour_value);
    $(".all_tour_"+tour_id).prop('checked', tour_value);
    periods_value = false;
  }
  
  if(periods_value==true){
    $(".tour_"+tour_id).prop('checked', periods_value);
    $(".all_tour_"+tour_id).prop('checked', periods_value);
  }
   
  /*
  $("#periods_"+tour_id).prop('checked', periods_value && tour_value);
  
  $.uniform.update();
  */
  
  if(periods_value==false && tour_value==true){
    $("#selector_periods_"+tour_id).fadeIn();
    
    
    // Load dynamically the content as it had memory problems
    $.ajax({
      type: "POST",
      url: tk_base_url + "admin/campaign/periodSelector/" + tour_id,
      dataType: "html",
      async: true,
    }).success(function(data) {
      //alert(window.location.hostname);
      $("#selector_periods_"+tour_id).html(data);
    }).complete(function(data) {
      // What to do here? TODO
    }).error(function(data) {
      //alert(window.location.hostname);
      alert("There was an error loading the period  data: "+data['responseText']);
    });
  }
  else{
    $("#selector_periods_"+tour_id).fadeOut();
    //alert("I should remove the content here?");
  }
  
  $.uniform.update();
}

function selectSpecificPeriod(period_id, period_value){
  $("#all_departures_"+period_id).prop('checked', period_value);
  $.uniform.update();
}

function selectSpecificDepartures(period_id, value){
  
  //alert(tk_base_url + "admin/campaign/departureSelector/" + period_id);
  if(value==true){
    $("#specific_departures_"+period_id).fadeOut();
  }
  else{
    $("#specific_departures_"+period_id).fadeIn();
    
    // Load dynamically the content as it had memory problems
    $.ajax({
      type: "POST",
      url: tk_base_url + "admin/campaign/departureSelector/" + period_id,
      dataType: "html",
      async: true,
    }).success(function(data) {
      $("#specific_departures_"+period_id).html(data);
    }).complete(function(data) {
      // What to do here? TODO
    }).error(function(data) {
      alert("There was an error loading the period  data: "+data['responseText']);
    });
  }
  $.uniform.update();
}

var survey = function(selector, callback) {
  var input = $(selector);
  var oldvalue = input.val();
  setInterval(function(){
     if (input.val()!=oldvalue){
         oldvalue = input.val();
         callback();
     }
  }, 100);
}

var initApplication = function() {
  var linkAux = false;
  survey('#campaign_retailerGroupsId', function(){    
    var link = $('a:contains("Add retailer")').eq(1);
    if(linkAux == false) {
      linkAux = link.attr('href');
    }
    link.attr('href', linkAux + $('#campaign_retailerGroupsId').val());
  });
}

