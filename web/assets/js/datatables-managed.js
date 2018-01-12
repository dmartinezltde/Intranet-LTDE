/* The default initialization options for the datatables. */
var defaultOptions = {
  // Internationalisation. For more info refer to http://datatables.net/manual/i18n
  "language": {
    "aria": {
      "sortAscending": ": activate to sort column ascending",
      "sortDescending": ": activate to sort column descending"
    },
    "emptyTable": "No data available in table",
    "info": "Showing _START_ to _END_ of _TOTAL_ records",
    "infoEmpty": "No records found",
    "infoFiltered": "(filtered1 from _MAX_ total records)",
    "lengthMenu": "Show _MENU_",
    "search": "Search:",
    "zeroRecords": "No matching records found",
    "paginate": {
      "previous":"Prev",
      "next": "Next",
      "last": "Last",
      "first": "First"
    }
  },

  // Or you can use remote translation file
  //"language": {
  //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
  //},

  // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
  // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
  // So when dropdowns used the scrollable div should be removed.
  //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

  "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

  "columnDefs": [ //the last two columns are not serchable nor orderable
    { "targets": [-1],
      "orderable": false,
      "searchable": false
    },
    { "targets": [-2],
      "orderable": false,
      "searchable": false
    }
  ],

  "lengthMenu": [
    [10, 20, 50, -1],
    [10, 20, 50, "All"] // change per page values here
  ],
  "pageLength": 10, // set the initial value
  "pagingType": "bootstrap_full_number",
  "order": [
    [0, "asc"]
  ] // set first column as a default sort by asc
};

/**
 * initDefaultTable.
 * Initializes the datatable with the passed selector and options.
 *
 * @param selector string
 * @param options array
 * @returns object
 */
var initDefaultTable = function(selector, options) {
  var table = $(selector);
  // begin first table
  table.dataTable(options);

  var tableWrapper = jQuery(selector + '_wrapper');

  table.find('.group-checkable').change(function () {
    var set = jQuery(this).attr("data-set");
    var checked = jQuery(this).is(":checked");
    jQuery(set).each(function () {
      if (checked) {
        $(this).prop("checked", true);
        $(this).parents('tr').addClass("active");
      } else {
        $(this).prop("checked", false);
        $(this).parents('tr').removeClass("active");
      }
    });
    jQuery.uniform.update(set);
  });

  table.on('change', 'tbody tr .checkboxes', function () {
    $(this).parents('tr').toggleClass("active");
  });

  return table;
};

var TableDatatablesManaged = function () {
  /**
   * initTable1.
   * Initializes the datatable disabling the order of the last two columns
   */
  var initTable1 = function () {
    var table = initDefaultTable('#datatable_1', defaultOptions);
  };

  /**
   * initTable2.
   * Initializes the dataTable disabling the order of the first and last columns.
   */
  var initTable2 = function () {
    var options = defaultOptions;
    options['columnDefs'] = [
      { "targets": [0],
        "orderable": false,
        "className": "dt-body-left",
        "searchable": false
      },
      { "targets": [-1],
        "orderable": false,
        "searchable": false
      }
    ];
    var table = initDefaultTable('#datatable_2', options);

    //For notifications tables
    options["pageLength"] = 20;
    var table2 = initDefaultTable('.datatable_2', options);
  };

  /**
   * initTable3.
   * Initializes the dataTable disabling the order of the last column.
   */
  var initTable3 = function () {
    var options = defaultOptions;
    options['columnDefs'] = [
      { "targets": [-1],
        "orderable": false,
        "searchable": false
      }
    ];
    var table = initDefaultTable('#datatable_3', options);
  };
  
  /**
   * initRowReorderableTable.
   * Initializes the dataTable allowing users reordering the rows
   */
  var initRowReorderableTable = function () {
    //var options = defaultOptions;
    var options = {};
    options["bStateSave"] = true,
    options["orderable"] = true;
    options["rowReorder"] = true;
    var table = initDefaultTable('#datatable_rowreorder', options);
  };


  return {
    //main function to initiate the module
    init: function () {
      if (!jQuery().dataTable) {
        return;
      }

      initTable1();
      initTable2();
      initTable3();
      initRowReorderableTable();
    }
  };

}();

if (App.isAngularJsApp() === false) {
  jQuery(document).ready(function() {
    TableDatatablesManaged.init();
  });
}