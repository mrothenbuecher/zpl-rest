var changeTimespan;

$(document).ready(function() {

  var components = {};

  $('#jobprinter').click(function(){
    $('#jobprinter').text("Printer");
    $('#jobprinter').data("printer","");
    console.log("asd 2");
    $(this).parent().find('a.dropdown-item').each(function() {
      var $item = $(this);
      console.log("asd");
      if ($item.data("events") == undefined) {
        $item.click(function(ev) {
          var $this = $(this);
          $('#jobprinter').text($this.text());
          $('#jobprinter').data("printer",$this.data("id"));
          console.log("Klappt");
        });
      }
    });
  });

  $('#gzpl').change(function(){
    if($('#jobprinter').data("printer")){
      $.ajax({
        url: "/rest/preview",
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
          printer: $('#jobprinter').data("printer"),
          label: $('#jobModal').data("job").label_id,
          zpl: $('#gzpl').val()
        }),
        dataType: 'json',
        success: function(data) {
          $("#imgContainer").find("img").attr("src","data:image/png;base64, "+data.img);
        },
        error: function(data) {
          toastr.error(JSON.stringify(data),'preview failed')
        }
      });
    }else {
      toastr.error("printer required");
    }
  });

  $('#reprint').click(function(){
    if($('#jobprinter').data("printer")){
      $.ajax({
        url: "/rest/reprint/"+$('#jobModal').data("job")._id,
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
          printer: $('#jobprinter').data("printer"),
          zpl: $('#gzpl').val()
        }),
        dataType: 'json',
        success: function(data) {
          toastr.info("reprint done");
        },
        error: function(data) {
          toastr.error(JSON.stringify(data),'reprint failed')
        }
      });
    }else {
      toastr.error("printer required");
    }
  });

  changeTimespan = function(hours) {
    var now = new Date();
    $.getJSON("/rest/jobs", function(data) {
      var result = [];
      $.each(data, function(index, job) {
        var jobDate = new Date(job.date);
        var delta = Math.abs(now - jobDate) / 1000 / 60 / 60;
        if (delta <= hours) {
          result.push(job);
        }
      });

      if (components['#table']) {
        components['#table'].destroy();
      }

      $tbody = $("#table").find("tbody");
      $tbody.html("");

      result.forEach(function(job) {
        var timeStamp = new Date(job.date);
        $row = $('<tr><td>' + job.printer_name + '</td><td>' + job.label_name + '</td><td data-order="' + timeStamp.getTime() + '">' + (timeStamp.toISOString()) + '</td><td>' + (typeof job.error !== "undefined" ? (JSON.stringify(job.error)) : "") + '</td><td><div class="btn-group" role="group"><button class="btn btn-secondary review"><i class="fas fa-fw fa-search"></i></button><button class="btn btn-primary print"><i class="fas fa-fw fa-print"></i></button></div></td></tr>');
        $row.data("job", job);
        $row.find('.print').click(function() {
          $.ajax({
            url: "/rest/reprint/" + job._id,
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
              if (data.failed == false)
                toastr.info('reprint was send');
              else
                toastr.error(data.error, 'reprint failed');
            },
            error: function(data) {
              toastr.error('reprint failed')
            }
          });
        });

        $row.find('.review').click(function() {

          $.ajax({
            url: "/rest/preview",
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
              printer: job.printer_id,
              label: job.label_id,
              zpl: job.zpl
            }),
            dataType: 'json',
            success: function(data) {
              $("#imgContainer").find("img").attr("src","data:image/png;base64, "+data.img);
            },
            error: function(data) {
              $("#imgContainer").find("img").attr("src","");
              toastr.error(JSON.stringify(data),'preview failed')
            }
          });

          $('#data').val(JSON.stringify(job.data, null, 2));
          $('#zpl').val(job.label_zpl);
          $('#gzpl').val(job.zpl);
          $('#json').val(JSON.stringify(job, null, 2));

          if($('#jobprinter').parent().find('.dropdown-item[data-id="'+job.printer_id+'"]').length > 0){
            var text = $('#jobprinter').parent().find('.dropdown-item[data-id="'+job.printer_id+'"]').text();
            $('#jobprinter').text(text);
            $('#jobprinter').data("printer",job.printer_id);
          }else{
            $('#jobprinter').text("Printer");
            $('#jobprinter').data("printer","");
          }

          $('#jobModal').data("job", job);
          $('#jobModal').modal();
        });
        $tbody.append($row);
      });

      //
      components['#table'] = $('#table').DataTable({
        "lengthMenu": [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
        ],
        "order": [[ 2, "desc" ]]
      });

    });
  };

  changeTimespan(parseInt($('#timespan').data("time")));
});
