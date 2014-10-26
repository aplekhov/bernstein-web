require 'rspec'
$:.unshift( File.join( File.dirname( __FILE__), '..', 'lib' ) )
require 'bernstein_web'

RSpec.configure do |c|
  c.mock_with :rspec
end

