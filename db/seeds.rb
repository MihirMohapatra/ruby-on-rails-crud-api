Product.find_or_create_by!(name: "Notebook") do |product|
  product.description = "A5 ruled notebook"
  product.price = 5.99
  product.quantity = 25
end
