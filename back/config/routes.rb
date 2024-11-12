Rails.application.routes.draw do
  # deviseの導入
  devise_for :users
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
