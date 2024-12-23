Rails.application.routes.draw do

  # deviseの導入
  devise_for :users, path: 'users', controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords'
  }


  # API用のDevise Token Auth
  namespace :api do
    namespace :v1 do
      mount_devise_token_auth_for 'User', at: 'auth',controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations',
        passwords: 'api/v1/auth/passwords'
      }
      # 認証状態確認用のエンドポイント
      get 'auth_status', to: 'auth/sessions#auth_status'
    end
  end

  # home
  get 'home/index'
  root to: 'home#index'
  # privacy & term
  get '/privacy', to: 'high_voltage/pages#show', id: 'privacy'
  get '/term', to: 'high_voltage/pages#show', id: 'term'
  # contact
  resources :contacts, only: [:new, :create]
  # メール確認用
  # if Rails.env.development?
  #   mount LetterOpenerWeb::Engine, at: "/letter_opener"
  # end

  resources :missions
  resources :tasks
  # dashboard
  get 'dashboard', to: 'dashboard#show', as: :dashboard
end
