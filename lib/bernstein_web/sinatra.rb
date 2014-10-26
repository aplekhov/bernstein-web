require "sinatra/json"
require 'bernstein'

module BernsteinWeb
  module Sinatra
    def self.included(klass)
      BernsteinWeb.initialize!
      klass.class_eval do
        get '/osc/status' do
          json :status => RequestHandling.get_status(params)
        end

        post '/osc/new_message' do
          puts params.inspect
          json :id => RequestHandling.new_osc_message(params)
        end
      end
    end
  end
end
