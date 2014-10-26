require 'helper'

describe BernsteinWeb::RequestHandling do
  subject { BernsteinWeb::RequestHandling }

  describe "sending a message" do
    it "should extract out the address and parameters and call the client to send it" do
      expect(Bernstein::Client).to receive(:send_message).with('/test', 999)
      subject.new_osc_message({'osc_msg_address' => '/test', 'osc_msg_params' => ["i999"]})
    end

    it "should correctly coerce parameter types" do
      expect(Bernstein::Client).to receive(:send_message).with('/test', 999, 32.45, 'foo')
      subject.new_osc_message({'osc_msg_address' => '/test', 'osc_msg_params' => ["i999", "f32.45", "sfoo"]})
    end

    it "should throw an error when there is an unknown parameter type" do
      bad_params = ["i999", "x32.45", "sfoo"]
      expect do
        subject.new_osc_message({'osc_msg_address' => '/test', 'osc_msg_params' => bad_params})
      end.to raise_error
    end

    it "should accept a param hash with no osc parameters" do
      expect(Bernstein::Client).to receive(:send_message).with('/test')
      subject.new_osc_message({'osc_msg_address' => '/test'})
    end

    it "should throw an error when there is a missing address" do
      expect{subject.new_osc_message({'osc_msg_params' => ['i5']})}.to raise_error
    end

    it "should support a single osc parameter" do
      expect(Bernstein::Client).to receive(:send_message).with('/single_test', -4534.542)
      subject.new_osc_message({'osc_msg_address' => '/single_test', 'osc_msg_params' => "f-4534.542"})
    end
  end

  describe "querying a message's status" do
    it "should query the client by message id" do
      expect(Bernstein::Client).to receive(:message_status).with("123123")
      subject.get_status({'osc_msg_id' => '123123'})
    end
  end
end

