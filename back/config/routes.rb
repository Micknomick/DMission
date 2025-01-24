Rails.application.routes.draw do

  # deviseの導入
  # devise_for :users, path: 'users', controllers: {
  #   sessions: 'users/sessions',
  #   registrations: 'users/registrations',
  #   passwords: 'users/passwords'
  # }

   # API用のDevise Token Auth
   namespace :api do
    namespace :v1 do
      resources :test, only: %i[index]

      # Devise Token Auth
      mount_devise_token_auth_for 'User', at: 'auth',
      controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations',
        passwords: 'api/v1/auth/passwords'
      }
      # タスク関連
      resources :tasks, only: [:index, :show, :create, :update, :destroy]
      # ミッション関連
      resources :missions, only: [:index, :show, :create, :update, :destroy]
      # チーム関連
      resources :teams, only: [:index, :show, :create, :update, :destroy] do
        member do
          post :invite # チーム招待のエンドポイント
        end
      end
      # チーム招待関連
      resources :team_invitations, only: [] do
        member do
          post :accept  # 招待承認のエンドポイント
          post :reject  # 招待拒否のエンドポイント
        end
        collection do
          get :index    # 招待一覧（オプションで追加）
        end
      end
      # 問い合わせ関連
      resources :contacts, only: [:create]
    end
  end


  ## Railsのみ場合に適用
  # home
  # get 'home/index'
  # root to: 'home#index'
  # privacy & term
  # get '/privacy', to: 'high_voltage/pages#show', id: 'privacy'
  # get '/term', to: 'high_voltage/pages#show', id: 'term'
  # contact
  # resources :contacts, only: [:new, :create]
  # メール確認用
  # if Rails.env.development?
  #   mount LetterOpenerWeb::Engine, at: "/letter_opener"
  # end

  # resources :missions
  # resources :tasks
  # dashboard
  # get 'dashboard', to: 'dashboard#show', as: :dashboard
end
