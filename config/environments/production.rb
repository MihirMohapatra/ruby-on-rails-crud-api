Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")
  config.cache_store = :memory_store
  config.active_job.queue_adapter = :async
  config.force_ssl = ENV["RAILS_FORCE_SSL"].present?
  config.active_record.dump_schema_after_migration = false
end
