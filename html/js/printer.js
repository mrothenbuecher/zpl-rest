$(document).ready(function() {

  $('#createprinter').click(function(ev) {
    $.ajax({
      url: "/rest/printer",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#newname').val(),
        address: $('#newaddress').val()
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('Printer saved');
        $('#newname').val("");
        $('#newaddress').val("");
      },
      error: function(data) {
        toastr.error('creation failed')
      }
    });
  });

  $('#delete-printer').click(function(ev) {
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $.ajax({
            url: "/rest/printer/" + $this.data("id"),
            type: 'delete',
            error: function(data) {
              toastr.error('delete failed')
            }
          });
        });
      }
    });
  });
});
