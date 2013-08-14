get '/' do
  session[:score] = 0
  erb :boggle
end

get '/check_word' do
  content_type :json
  p params
  word = Word.find_by_word(params[:word].downcase)
  session[:score] += word.length if word
  word ? {correct: true}.to_json : {correct: false}.to_json
end

get '/get_score' do
	session[:score].to_s
end