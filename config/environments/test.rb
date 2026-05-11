Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = ENV["CI"].present?
  config.public_file_server.enabled = true
  config.public_file_server.headers = { "Cache-Control" => "public, max-age=3600" }
  config.consider_all_requests_local = true
  config.cache_store = :null_store
  config.active_support.deprecation = :stderr
  config.active_job.queue_adapter = :test
end
