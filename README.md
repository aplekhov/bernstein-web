# Bernstein-web

Bernstein-web is a work-in-progress that aims to provide a simple way to build interactive web
interfaces that can control devices and processes via OSC.  The main components are 1) a jquery plugin
that allows for an OSC message to be sent via AJAX, and 2) server side hooks for web frameworks like
Rails and Sinatra.  Currently, it only works with Sinatra.

## Usage
Install all dependency gems

    bundle install

Make sure that Redis is running and start the bernstein background poller daemon:

    bernstein start -- -c bernstein.yml

Inside your Sinatra app:

```ruby
class WebServer < Sinatra::Application
  # this adds the following routes to your app: 
  # POST /osc/new_message and GET /osc/status
  include BernsteinWeb::Sinatra

  get '/' do
    # do whatever
    haml :index
  end
  run! if app_file == $0
end
```

Now in your view, include jquery.osc.js:

```html
<script src='/javascripts/jquery.osc.js' type='text/javascript'></script>
```

And in your client-side javascript you can do this:

```javascript
// Here is the method signature
// $.sendOSCMessage(address, parametersArray, successCallback, settings = {})

// example usage:
$.sendOSCMessage('/synth/frequencies', [23.4, 546.3, 342.4], function({ alert('Whohoo!'); }));

// Note, number and string datatypes will be respected:
$.sendOSCMessage('/fx/params', ['sawtooth', 0.34], function({}));

// Add error\timeout handler and set polling interval and max. number of polls:
$.sendOSCMessage('/synth/scale', ['diminished'], 
  function({ alert('Whohoo'); }),
  {
    pollingInterval: 1000,
    maxStatusChecks: 3,
    onError: function({ alert('Error!'); })
  });

// It's also possible to set the context for your callbacks:

$('.oscLink').click(function(){
  $(this).text('sending...');
  $.sendOSCMessage('/make_sound', [], function({
    $(this).text('poof!').removeClass('oscLink');
  }),
  {
    context: this
  });
});
```

See demos.js for more examples.

## Demo app
You can mess around with sending OSC messages from your browser by running the demo sinatra app
    
    ruby demos.rb

There is also a PureData patch in the apps directory that can be controlled via OSC.  More patches and interfaces for
PureData, SuperCollider and Chuck soon!

## License
The MIT License.  Copyright (c) 2014 Anthony Plekhov. See LICENSE.
