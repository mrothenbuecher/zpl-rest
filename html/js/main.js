$(document).ready(function() {
  updatePrinterDropdown();
  updateLabelDropdown();

  $('#timespan').text($('.time-item[data-time="'+$('#timespan').data("time")+'"]').text());

  $('.time-item').click(function() {
    $this = $(this);
    var hours = parseInt($this.data("time"));
    $('#timespan').text($this.text());
    $('#timespan').data("time", hours);

    $.ajax({
      url: "/rest/timespan/"+hours,
      type: 'post',
      contentType: 'application/json',
      dataType: 'json',
      error: function(data) {
        toastr.error('failed to update timespan')
      }
    });

    if(typeof changeTimespan === "function")
      changeTimespan(hours);
  });

  $('.copy-button').click(function(){
    $this = $(this);
    if(!$this.data("target")){
      toastr.error("no target defined for this button")
      return;
    }

    var element = "#"+$this.data("target");
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).val()).select();
    document.execCommand("copy");
    $temp.remove();
    toastr.info("copied to clipboard");
  });

});

function updatePrinterDropdown() {
  $('.printer-dropdown').html("");
  $('.printer-dropdown').each(function() {
    var $this = $(this);
    $.getJSON("/rest/printer", function(data) {
      $.each(data, function(index, value) {
        $this.append('<a class="dropdown-item" data-id="'+value._id+'" href="#">'+value.name+' - '+value.address+'</a>');
      });
    });
  });
}

function updateLabelDropdown() {
  $('.label-dropdown').html("");
  $('.label-dropdown').each(function() {
    var $this = $(this);
    $.getJSON("/rest/label", function(data) {
      $.each(data, function(index, value) {
        $this.append('<a class="dropdown-item" data-id="'+value._id+'" href="#">'+value.name+'</a>');
      });
    });
  });

}
