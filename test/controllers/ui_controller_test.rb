require "test_helper"

class UiControllerTest < ActionDispatch::IntegrationTest
  test "renders the products ui" do
    get root_url

    assert_response :success
    assert_includes response.body, "Products"
  end
end
