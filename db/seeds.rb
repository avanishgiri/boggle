File.readlines("words.txt").each do |line|
	Word.create(word: line.chomp);
end