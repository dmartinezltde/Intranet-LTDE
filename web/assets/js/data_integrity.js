$(document).ready(function() {
    
    var searchForm = '<div class="row">\n\
    <div class="col-md-12">\n\
        <div class="portlet light">\n\
            <div class="portlet-title">\n\
                <div class="caption"><i class="fa fa-search font-dark"></i> \n\
                    <span class="caption-subject font-dark sbold uppercase">DATA INCONSISTENCIES FILTER</span>\n\
                    </div>    \n\
            </div>    \n\
            <div class="row">\n\
                <div class="col-md-6">    \n\
                    <div class="col-md-3"><label>Search by content</label></div>\n\
                    <div class="col-md-9">\n\
                        <input type="text" onKeyUp="initSearchFunctions();" class="form-control inputSearch" id="toSearch" />    \n\
                    </div>\n\
                </div>\n\
                <div class="col-md-6">    \n\
                    <div class="col-md-3"><label>Search by portlet</label></div>\n\
                    <div class="col-md-9">\n\
                        <input type="text" onKeyUp="initSearchPortletFunctions();" class="form-control inputSearch" id="toSearchPortlet" />    \n\
                    </div>\n\
                </div>\n\
            </div>\n\
        </div>\n\
    </div>\n\
</div>';
    
    $('div.page-content-inner').html(searchForm + $('div.page-content-inner').html());
    
    initSearchFunctions = function() {
        var tables = $('tbody');
        
        input = $('#toSearch');
        filter = input.val().toUpperCase();
        
        /*
         * Recorremos las tablas existentes
         */
        for(i = 0; i < tables.length; i++) {
            tr = tables[i].getElementsByTagName("tr");
            
            /*
             * Recorremos las filas
             */
            for (a = 0; a < tr.length; a++) {
              td = tr[a].getElementsByTagName("td");
              
              var finded = false;
              
                /*
                 * Recorremos las columnas
                 */
                for(b = 0; b < td.length; b++) {
                  if (td[b]) {
                    
                    if (td[b].innerHTML.toUpperCase().indexOf(filter) > -1) {
                      finded = true;
                      //tr[a].style.display = "";
                    } else {
                      if(!finded) {
                          finded = false;
                      }
                      //tr[a].style.display = "none";
                    }
                  }
                }
                
                if(finded) {
                    tr[a].style.display = "";
                } else {
                    tr[a].style.display = "none";
                }
              
            }
        }
    };
    
    initSearchPortletFunctions = function() {
        var titles = $(".caption");
        
        input = $("#toSearchPortlet");
        filter = input.val().toUpperCase();
        
        for(i = 1; i < titles.length; i++) {
            title = titles[i].getElementsByTagName("span");
            
            if(title[0].innerHTML.toUpperCase().indexOf(filter) > -1) {
                titles[i].parentElement.parentElement.parentElement.parentElement.style.display = "";
            } else {
                titles[i].parentElement.parentElement.parentElement.parentElement.style.display = "none";
            }
        }
    };
});