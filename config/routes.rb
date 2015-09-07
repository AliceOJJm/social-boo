Rails.application.routes.draw do
  root to: redirect('/app')#'app#index'#, anchor: false
  get "/app", to: "app#index"
  get "/app/*path", to: "app#index"
  
  devise_for :users, :controllers => { registrations: 'registrations', sessions: 'sessions' }
  
  resources :users, only: [:show, :index, :edit, :update] do
    resources :subscribtions, only: [:create, :destroy, :edit]
    resources :friends, only: [:index]
    resources :posts do
      get '/toggle_like', to: 'posts#toggle_like'
    end
    resources :pictures do
      get '/toggle_like', to: 'pictures#toggle_like'
    end
    resources :dialogues
    resources :messages
  end
  resources :comments do
      get '/toggle_like', to: 'comments#toggle_like'
  end
  resources :songs do
      get '/toggle_like', to: 'songs#toggle_like'
  end
  resources :videos do
      get '/toggle_like', to: 'videos#toggle_like'
  end
  resource :tags
  resources :communities
  get '/communities/:id/join', to: 'communities#join'
  get '/communities/:id/leave', to: 'communities#leave'
  post '/users/:id/edit', to: 'users#edit'
  get '/users/:id/userpage_media', to: 'users#userpage_media'
  get 'search', to: 'search#index'
end