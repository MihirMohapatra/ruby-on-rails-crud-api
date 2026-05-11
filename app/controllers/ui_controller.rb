class UiController < ActionController::Base
  def index
    render file: Rails.root.join("public", "index.html").to_s, layout: false
  end

  def styles
    send_file Rails.root.join("public", "styles.css").to_s, type: "text/css", disposition: "inline"
  end

  def javascript
    send_file Rails.root.join("public", "app.js").to_s, type: "application/javascript", disposition: "inline"
  end
end
