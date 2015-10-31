# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151031171016) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "portfolios", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stocks", force: true do |t|
    t.integer  "price"
    t.integer  "EV_to_EBITDA"
    t.integer  "P_to_E"
    t.integer  "P_to_B"
    t.integer  "P_to_FCF"
    t.integer  "marketcap"
    t.integer  "ROE"
    t.integer  "ROA"
    t.integer  "ROCI"
    t.integer  "EV_to_FCF"
    t.string   "country"
    t.string   "sector"
    t.string   "company_name"
    t.string   "ticker_symbol"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
