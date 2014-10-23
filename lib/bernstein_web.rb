require "sinatra/json"
require 'bernstein'

module BernsteinWeb
  def self.included(klass)
    Bernstein.configure_from_yaml!('bernstein.yml')
    klass.class_eval do
      get '/osc/status' do
        json :status => Bernstein::Client.message_status(params['message_id'])
      end

      post '/osc/new_message' do
        json :id => Bernstein::Client.send_message_by_string("#{params['message_address']} #{(params['message_params'] || []).join(' ')}")
      end
    end
  end
end
