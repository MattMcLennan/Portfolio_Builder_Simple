class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.integer :price
      t.integer :EV_to_EBITDA
      t.integer :P_to_E
      t.integer :P_to_B
      t.integer :P_to_FCF
      t.integer :marketcap
      t.integer :ROE
      t.integer :ROA
      t.integer :ROCI
      t.integer :EV_to_FCF
      t.string :country
      t.string :sector
      t.string :company_name
      t.string :ticker_symbol

      t.timestamps
    end
  end
end
