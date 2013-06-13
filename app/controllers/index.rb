get '/' do
  erb :boggle
end

get '/check_word' do
  content_type :json
  word = Word.find_by_word(params[:word])
  word ? {correct: true} : {correct: false}
end
