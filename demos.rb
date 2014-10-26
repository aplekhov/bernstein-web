require 'sinatra/base'
require 'haml'

$:.unshift( File.join( File.dirname( __FILE__), 'lib') )
require 'bernstein_web'

class WebServer < Sinatra::Application
  include BernsteinWeb::Sinatra

  get '/' do
    haml :index
  end
  run! if app_file == $0
end
