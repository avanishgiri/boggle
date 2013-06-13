class CreateWords < ActiveRecord::Migration
  def change
  	create_table do |t|
  		t.string :word
  	end
  end
end
