get '/' do
  erb :boggle
end

get '/check_word' do
  content_type :json
  p params
  word = Word.find_by_word(params[:word].downcase)
  p word
  word ? {correct: true}.to_json : {correct: false}.to_json
end
