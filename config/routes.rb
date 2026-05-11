Rails.application.routes.draw do
  root "ui#index"
  get "styles.css" => "ui#styles"
  get "app.js" => "ui#javascript"

  resources :products

  get "up" => "rails/health#show", as: :rails_health_check
end
