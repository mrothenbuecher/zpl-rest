$(document).ready(function() {

  $('.density-item').click(function(){
    $this = $(this);
    var button = $this.parent().parent().find('.dropdown-toggle');
    button.text($this.text());
    button.data("density",$this.data("density"));
  });

  $('#edit-printer').click(function(ev) {
    $('#printerid').val("");
    $('#editname').val("");
    $('#editaddress').val("");
    $('#editdensity').data("density","")
    $('#editdensity').text("Density / Resolution")
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $.getJSON("/rest/printer/", function(data) {
            $.each(data, function(index, value) {
              if (value._id == $this.data("id")) {
                $('#printerid').val(value._id);
                $('#editname').val(value.name);
                $('#editaddress').val(value.address);
                var text = $('#editdensity').parent().find('.density-item[data-density="'+value.density+'"]').text();
                $('#editdensity').text(text);
                $('#editdensity').data("density",value.density);
                return;
              }
            });
          });

        });
      }
    });
  });

  $('#editprinter').click(function(ev) {
    if(!$('#printerid').val()){
      toastr.error("Printer is required")
      return;
    }
    if(!$('#editname').val()){
      toastr.error("Name is required")
      return;
    }
    if(!$('#editaddress').val()){
      toastr.error("Address is required")
      return;
    }
    if(!$('#editdensity').data("density")){
      toastr.error("Density is required")
      return;
    }

    $.ajax({
      url: "/rest/printer",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        _id: $('#printerid').val(),
        name: $('#editname').val(),
        address: $('#editaddress').val(),
        density: $('#editdensity').data("density")
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('Printer updated');
        $('#printerid').val("")
        $('#editname').val("");
        $('#editaddress').val("");
        $('#editdensity').data("density","")
        $('#editdensity').text("Density / Resolution")
      },
      error: function(data) {
        toastr.error(data, 'update failed')
      }
    });
  });

  $('#createprinter').click(function(ev) {
    if(!$('#newname').val()){
      toastr.error("Name is required")
      return;
    }
    if(!$('#newaddress').val()){
      toastr.error("Address is required")
      return;
    }
    if(!$('#newdensity').data("density")){
      toastr.error("Density is required")
      return;
    }

    $.ajax({
      url: "/rest/printer",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#newname').val(),
        address: $('#newaddress').val(),
        density: $('#newdensity').data("density")
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('Printer saved');
        $('#newname').val("");
        $('#newaddress').val("");
        $('#newdensity').data("density","")
        $('#newdensity').text("Density / Resolution")
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
            success: function(data) {
              toastr.info("printer deleted");
            },
            error: function(data) {
              toastr.error('delete failed')
            }
          });
        });
      }
    });
  });
});
