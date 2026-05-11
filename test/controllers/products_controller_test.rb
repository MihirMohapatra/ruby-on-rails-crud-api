require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  test "lists products" do
    get products_url

    assert_response :success
    assert_includes response.parsed_body.first["name"], "Notebook"
  end

  test "creates a product" do
    assert_difference("Product.count", 1) do
      post products_url, params: {
        product: {
          name: "Pen",
          description: "Black ink pen",
          price: 1.50,
          quantity: 10
        }
      }
    end

    assert_response :created
    assert_equal "Pen", response.parsed_body["name"]
  end

  test "updates a product" do
    product = products(:notebook)

    patch product_url(product), params: { product: { quantity: 30 } }

    assert_response :success
    assert_equal 30, response.parsed_body["quantity"]
  end

  test "deletes a product" do
    product = products(:notebook)

    assert_difference("Product.count", -1) do
      delete product_url(product)
    end

    assert_response :no_content
  end
end
