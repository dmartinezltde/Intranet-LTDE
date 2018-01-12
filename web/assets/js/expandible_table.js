function setUpdateExpandibleTableContainer(type) {
  $('a.updateList').bind('click', function(e){
    e.preventDefault();
    var container = $(this).parent().find('div.' + type);
    var preload = ($(this).attr('data-preload') === 'false') ? false : true;

    if ($(this).find('i').hasClass('fa-caret-right')) {
      
      if (!preload) {
        updateFromAjax($(this).attr('href'), '#' + container.attr('id'), false);
        $(this).attr('data-preload', 'true');
      }
      container.slideDown();
      $(this).find('i').removeClass('fa-caret-right');
      $(this).find('i').addClass('fa-caret-down');
      $(this).find('span').text('Hide contracts and services');

    } else {
      container.slideUp();
      $(this).find('i').removeClass('fa-caret-down');
      $(this).find('i').addClass('fa-caret-right');
      $(this).find('span').text('View contracts and services');
    }
  });
}

var initExpandibleListeners = function() {
  setUpdateExpandibleTableContainer('expandibles');
};

initExpandibleListeners();
