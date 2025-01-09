require_relative "boot"

require "rails/all"
require 'devise'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    config.api_only = true
    # タイムゾーンを日本時間に設定
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local

    # Herokuのホスト名を許可
    config.hosts << "dmission-a0c003887d75.herokuapp.com"

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # # セッションとCookieの設定
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options

    # CORSとCookie関連の設定
    config.action_dispatch.cookies_same_site_protection = :none
    config.action_controller.forgery_protection_origin_check = false
  end
end
