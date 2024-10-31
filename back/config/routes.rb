Rails.application.routes.draw do
  devise_for :users
  get 'home/index'
  root to: 'home#index'
  get '/privacy', to: 'high_voltage/pages#show', id: 'privacy'
  get '/term', to: 'high_voltage/pages#show', id: 'term'
end
