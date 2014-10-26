function logMessage(message, success = true){
  var statusClass = success ? 'success' : 'error';
  var time = (new Date).toLocaleTimeString();
  $('.message-log').append("<tr class=\""+statusClass+"\"><td>"+time+" - "+message+"</td></tr>");
}

$(function() {
  $('form.osc-text-form').submit(function(event){
    // prevent form being submitted
    event.preventDefault();
    // get form elements
    var form = $(this);
    var formControls = form.find(':input');
    var statusDisplay = form.find('.status');
    var spinner = form.find('.spinner');
    var formData = {};
    // get form data, setting proper type as necessary
    $.each(form.serializeArray(),function(index,field){ formData[field.name] = field.value });
    if (formData.parameter_type ==  "Float") formData.message_parameter = Number(formData.message_parameter);
    if(formData.message_address == '') return false;
    var msg = formData.message_address + " " + formData.message_parameter;
    // disable form and show spinner
    formControls.attr("disabled","disabled");
    spinner.show();
    statusDisplay.text('Status:');

    $.sendOSCMessage(formData.message_address, [formData.message_parameter], function(){
      // re-enable form and log message
      formControls.attr("disabled",false);
      statusDisplay.addClass('text-success').text('Status: Success!');
      spinner.hide();
      logMessage(msg);
      form.find(":input[type='text']").val('');
      },
      {
        onError: function(error){
          // re-enable form and log failed message
          formControls.attr("disabled",false);
          statusDisplay.addClass('text-success').text('Status: Error!');
          spinner.hide();
          logMessage(msg, false);
      },
      context: this
      }
    );
  });

  // initialize sliders
  $('.slider.vertical').slider({min: 0, max: 1, orientation: 'vertical', step: 0.01});
  $('.slider.horizontal').slider({min: 0, max: 1, orientation: 'horizontal', step: 0.01});
 
  // slider logic
  $('form.osc-slider-form').on("slidechange", function( event, ui ) {
    var form = $(this);
    var formControls = form.find('.slider');
    var spinner = form.find('.spinner');
    var address = form.find(":input[name='message_address']").val();
    if(address == '') return false;
    var parameters = $.map(form.find('.slider'), function(e){return Number($(e).slider('value'))});
    var msg = address + " " + parameters;
    formControls.slider("disable");
    spinner.show();
    $.sendOSCMessage(address, parameters, function(){
      // re-enable form and log message
      formControls.slider("enable");
      spinner.hide();
      logMessage(msg);
      },
      {
        onError: function(error){
          // re-enable form and log failed message
          formControls.slider("enable");
          spinner.hide();
          logMessage(msg,false);
      },
      context: this
      }
    );
  });

  $('form.osc-radio-form').on("change", function(event){
    // prevent form being submitted
    event.preventDefault();
    // get form elements
    var form = $(this);
    var formControls = form.find(':input');
    var spinner = form.find('.spinner');
    var formData = {};
    // get form data, setting proper type as necessary
    $.each(form.serializeArray(),function(index,field){ formData[field.name] = field.value });
    if(formData.message_address == '') return false;
    var msg = formData.message_address + " " + formData.message_parameter;
    console.log(msg);
    // disable form and show spinner
    formControls.attr("disabled","disabled");
    spinner.show();

    $.sendOSCMessage(formData.message_address, [formData.message_parameter], function(){
      // re-enable form and log message
      formControls.attr("disabled",false);
      spinner.hide();
      logMessage(msg);
      },
      {
        onError: function(error){
          // re-enable form and log failed message
          formControls.attr("disabled",false);
          spinner.hide();
          logMessage(msg, false);
      },
      context: this
      }
    );
  });
});
