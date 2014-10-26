require 'bernstein'
require 'bernstein_web/sinatra'

module BernsteinWeb
  def self.initialize!(config_file = 'bernstein.yml')
    Bernstein.configure_from_yaml!(config_file)
  end

  module RequestHandling
    # expects the params hash to include keys osc_msg_address and osc_message_params, that maps to an array of parameters, or one parameter string.  
    # Each param is expected to begin with the letter i, f, or s to designate the data types integer, float and string respectively.
    def self.new_osc_message(params)
      raise ArgumentError, "missing osc_msg_address key in params hash" if params['osc_msg_address'].nil?
      Bernstein::Client.send_message(params['osc_msg_address'], *coerce_params(params['osc_msg_params']))
    end

    def self.get_status(params)
      Bernstein::Client.message_status(params['osc_msg_id'])
    end

    def self.coerce_params params
      params ||= []
      params = params.is_a?(Array) ? params : [params]
      params.map do |param|
        case param[0]
          when "i" then Integer(param[1..-1])
          when "f" then Float(param[1..-1])
          when "s" then param[1..-1]
          else raise(TypeError, "#{param[0]} is not a valid type character")
        end
      end
    end
  end
end
