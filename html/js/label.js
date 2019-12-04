$(document).ready(function() {

  $('#create').click(function(ev) {
    $.ajax({
      url: "/rest/label",
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({
        name: $('#newname').val(),
        width: $('#newwidth').val(),
        height: $('#newheight').val()
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('label saved');
        $('#newname').val("");
        $('#newwidth').val("");
        $('#newheight').val("");
      },
      error: function(data) {
        toastr.error('creation failed')
      }
    });
  });

  $('#test-printer').click(function(ev) {
    $('#printerid').val("");
    $('#printerid').data("printer","");
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          var $this = $(this);
          $.getJSON("/rest/printer/", function(data) {
            $.each(data, function(index, value) {
              if (value._id == $this.data("id")) {
                $('#printerid').val(value._id);
                $('#printerid').data("printer",value);
                if($('#labelid').val() && $('#printerid').val()){
                  $("#imgContainer").find("img").attr("src","/rest/preview?printer="+encodeURIComponent($('#printerid').val())+"&label="+encodeURIComponent($('#labelid').val()));
                }
                enableTestButton();
                return;
              }
            });
          });
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
                $('#editwidth').val(value.width);
                $('#editwidth').data("original", value.width);
                $('#editheight').val(value.height);
                $('#editheight').data("original", value.height);
                $('#editzpl').val(value.zpl);
                $('#editzpl').data("original", value.zpl);
                if($('#labelid').val() && $('#printerid').val()){
                  $("#imgContainer").find("img").attr("src","/rest/preview?printer="+encodeURIComponent($('#printerid').val())+"&label="+encodeURIComponent($('#labelid').val()));
                }
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
        zpl: $('#editzpl').val(),
        width: $('#editwidth').val(),
        height: $('#editheight').val()
      }),
      dataType: 'json',
      success: function(data) {
        toastr.info('label updated');
        if($('#labelid').val() && $('#printerid').val()){
          $("#imgContainer").find("img").attr("src","/rest/preview?printer="+encodeURIComponent($('#printerid').val())+"&label="+encodeURIComponent($('#labelid').val()));
        }
        $('#editname').data("original", $('#editname').val());
        $('#editzpl').data("original", $('#editzpl').val());
        $('#editwidth').data("original", $('#editwidth').val());
        $('#editheight').data("original", $('#editheight').val());
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
    if($('#labelid').val() && $('#printerid').val()){
      $("#imgContainer").find("img").attr("src","/rest/preview?printer="+encodeURIComponent($('#printerid').val())+"&label="+encodeURIComponent($('#labelid').val())+"&zpl="+encodeURIComponent($('#editzpl').val()));
    }
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
            success: function(data){
              toastr.info('label deleted');
            },
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
      toastr.info("Label required")
      return;
    }


    var ok = true;
    ok = ok && $('#editname').val() == $('#editname').data("original");
    ok = ok && $('#editzpl').val() == $('#editzpl').data("original");
    ok = ok && $('#editheight').val() == $('#editheight').data("original");
    ok = ok && $('#editwidth').val() == $('#editwidth').data("original");
    if(!ok){
      toastr.info("Save the changed Label :)", "Save the Label")
      return;
    }

    var dat = {}

    if($('.json-data').length > 0){
      try{
        dat = JSON.parse($('.json-data').find('textarea').val());
        console.log("data: ",dat);
      }catch(err){
        toastr.error(err,"JSON not valid");
        return;
      }
    }else{
      $('.print-param').find('input').each(function() {
        $this = $(this);
        dat[$this.attr("id")] = $this.val();
      });
    }

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
    var reg = /\${(.{1,})}/gm;
    var mustache_reg = /{{(.*)}}/gm;
    $('.print-param').remove();
    var result;
    var keys = [];
    var duplicates = false;
    if(mustache_reg.exec($('#editzpl').val())){
      $('#printer-id-group').after('<div class="form-group print-param json-data"><label for="json">JSON - data</label><textarea class="form-control" id="json" placeholder="JSON" rows="5">{}</textarea></div>');
    }else{
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
