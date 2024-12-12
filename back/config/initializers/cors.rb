Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '127.0.0.1:4000', 'localhost:4000', 'https://dmission-app.vercel.app', "https://dmission-808839a564de.herokuapp.com/"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
