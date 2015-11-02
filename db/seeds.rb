# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'rubygems'
require 'nokogiri'
require 'open-uri'

url = "http://ca.advfn.com/stock-market/TSX/BMO/financials"
doc = Nokogiri::HTML(open(url))

# The following code will get us all of the company specific data we need
doc.css("table td").each do |i|
  
  if i.text == "Company Name: "
    puts i.next.text
  elsif i.text == "Industry Information: "
    puts i.next.text.match(/[A-Z]+/)
  elsif i.text == "PE Ratio - LTM"
    puts i.next.text
  elsif i.text == "Market Capitalisation"
    if i.next.next.text == "mil"
      val = i.next.text
      puts  val.gsub(/[^\d\.]/, '').to_f * 1_000_000
    end
  elsif i.text == "Enterprise Value (EV)/EBITDA"
    puts i.next.text
  elsif i.text == "Enterprise Value (EV)/Free Cash Flow"
    puts i.next.text
  elsif i.text == "Price/Book Ratio - LTM"
    puts i.next.text
  elsif i.text == "Price/Free Cash Flow Ratio - LTM"
    puts i.next.text
  elsif i.text == "Return on Equity (ROE)"
    puts i.next.text
  elsif i.text == "Return on Capital Invested (ROCI)"
    puts i.next.text
  elsif i.text == "Return on Assets (ROA)"
    puts i.next.text
  elsif i.text == "EBITDA Margin - LTM"
    puts i.next.text
  elsif i.text == "Net Profit Margin"
    puts i.next.text
  end
end