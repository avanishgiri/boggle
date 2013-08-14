class Word < ActiveRecord::Base
	def length
		self.word.length
	end
end
