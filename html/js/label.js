$(document).ready(function() {

  $('#create').click(function(ev) {
    $.ajax({
      url: "/rest/label",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#newname').val(),
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('label saved');
        $('#newname').val("");
      },
      error: function(data) {
        toastr.error('creation failed')
      }
    });
  });

  $('#test-printer').click(function(ev) {
    $('#printerid').val("");
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $('#printerid').val($this.data('id'));
          enableTestButton();
        });
      }
    });
  });

  $('#update-label').click(function(ev) {
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $.getJSON("/rest/label/", function(data) {
            $.each(data, function(index, value) {
              if (value._id == $this.data("id")) {
                $('#labelid').val(value._id);
                $('#editname').val(value.name);
                $('#editname').data("original", value.name);
                $('#editzpl').val(value.zpl);
                $('#editzpl').data("original", value.zpl);
                enableTestButton();
              }
            });
          });
        });
      }
    });
  });

  $('#update').click(function(ev) {
    $.ajax({
      url: "/rest/label",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        _id: $('#labelid').val(),
        name: $('#editname').val(),
        zpl: $('#editzpl').val()
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('label updated');
        $('#editname').data("original", $('#editname').val());
        $('#editzpl').data("original", $('#editzpl').val());
        enableTestButton();
      },
      error: function(data) {
        toastr.error('update failed')
      }
    });
  });

  $('#editname').change(function() {
    enableTestButton();
  });

  $('#editzpl').change(function() {
    enableTestButton();
  });

  $('#delete-label').click(function(ev) {
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $.ajax({
            url: "/rest/label/" + $this.data("id"),
            type: 'delete',
            error: function(data) {
              toastr.error('delete failed')
            }
          });
        });
      }
    });
  });

  $('#test').click(function() {

    if (!$('#printerid').val()) {
      toastr.info("Printer required")
      return;
    }
    if (!$('#labelid').val()) {
      toastr.info("Printer required")
      return;
    }


    var ok = true;
    ok = ok && $('#editname').val() == $('#editname').data("original");
    ok = ok && $('#editzpl').val() == $('#editzpl').data("original");
    if(!ok){
      toastr.info("Save the changed Label :)", "Save the Label")
      return;
    }

    var dat = {}

    $('.print-param').find('input').each(function() {
      $this = $(this);
      dat[$this.attr("id")] = $this.val();
    });

    $.ajax({
      url: "/rest/print",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        printer: $('#printerid').val(),
        label: $('#labelid').val(),
        data: dat
      }),
      dataType: 'json',
      success: function(data) {
        if(data.failed == false)
          toastr.info('job was send');
        else
          toastr.error(data.error, 'job failed');
      },
      error: function(data) {
        toastr.error('job failed')
      }
    });
  });

  function checkParams() {
    var reg = /\${(.{1,})}/g;
    $('.print-param').remove();
    var result;
    var keys = [];
    var duplicates = false;
    while ((result = reg.exec($('#editzpl').val())) !== null) {
      console.log("Keys", keys);
      if (keys.includes(result[1])) {
        toastr.info("Key:" + result[1], "Key duplicate found");
        duplicates = true;
      } else {
        keys.push(result[1]);
        $('#printer-id-group').after('<div class="form-group print-param"><label for="' + result[1] + '">' + result[1] + '</label><input type="text" class="form-control" id="' + result[1] + '" placeholder="' + result[1] + '"></div>');
      }
    }
    return duplicates;
  }

  function enableTestButton() {
    var ok = true;
    ok = ok && $('#printerid').val() != "";
    ok = ok && $('#labelid').val() != "";
    ok = ok && !checkParams();
    $('#test').prop("disabled", !ok);
  }

});
