require "test_helper"

class Api::ContactsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_contacts_create_url
    assert_response :success
  end
end
