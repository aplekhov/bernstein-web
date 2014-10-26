if(typeof(BERNSTEIN) == 'undefined') var BERNSTEIN = {DEBUG:true};

(function($) {

  var _debug = function(debuggingInfo){
    if(BERNSTEIN.DEBUG == true && window.console){
      window.console.debug(debuggingInfo);
    }
    else if(BERNSTEIN.DEBUG == true){
      alert(debuggingInfo);
    }
  };

  $.sendOSCMessage = $.sendOSCMessage || function(address, params, onSuccess, settings){
    _debug("in sendOSCMessage");
    var config = {'requestURL':'/osc/new_message', 
                  'statusURL':'/osc/status', 
                  'onError': function(error){ _debug(error);},
                  'pollingInterval': 2000, 
                  'maxStatusChecks': 5,
                  'context': window};
    if(settings) $.extend(config, settings);
    var requestId = null;
    var statusChecks = 0;
    var timerId = null;

    if(address.indexOf('/') != 0){
      throw new Error("OSC addresses must begin with a '/'");
    }

    var _stopStatusPolls = function(){
      _debug('stopping status polls');
      if(timerId != null){
        clearInterval(timerId);
        timerId = null;
      }
    };

    var _callError = function(error){
      _debug('calling error');
      _stopStatusPolls();
      config.onError.call(config.context, error);
    };

    var _pollStatus = function(){
      if(statusChecks >= config.maxStatusChecks){
        _callError('Timeout, status check limit exceeded');
        return;
      }

      _debug('checking status, #' + statusChecks);
      $.getJSON(config.statusURL, {osc_msg_id: requestId}, function(responseData){
          _debug(responseData);
          var status = responseData.status;
          statusChecks = statusChecks + 1;
         
          if(responseData.status == 'sent'){
            _stopStatusPolls();
            onSuccess.call(config.context);
          }
      }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        _callError('Failure checking status');
      });
    };

    _debug("making request");
    var typeCharacter = null;
    for (var i = 0; i < params.length; i++) { 
      switch(typeof(params[i])){
        // all numbers are treated as floats, no support for integers yet
        case 'number': 
          typeCharacter = "f";
          break;
        case 'string': 
          typeCharacter = "s";
      }
      params[i] = typeCharacter + params[i];
    }
    var data = {osc_msg_address: address, osc_msg_params: params};
    $.post(config.requestURL, data, function(responseData){
          _debug(responseData);
        requestId = responseData.id;
        timerId = setInterval(_pollStatus, config.pollingInterval);
    }, "json").fail(function( jqxhr, textStatus, error ) {
      _callError('Failure sending message');
    });
    return null;
  };
})(jQuery);
