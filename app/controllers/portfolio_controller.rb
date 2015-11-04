class PortfolioController < ApplicationController

  def index
  end

  def analyze
    # Storing string into a formattable array
    portfolio = params[:stocks].split(',').map do |pair|
      pair.split(':')
    end

    # Removing additional spaces from any part of the array
    portfolio.each do |pair|
      pf_spot = portfolio.index(pair)
      pair.each do |i|
        pair_spot = pair.index(i)
        portfolio[pf_spot][pair_spot] = portfolio[pf_spot][pair_spot][/\S+/]
      end
    end
    
    @portfolio_analyze = []

    portfolio.each do |pair|
      @stock = {}
      url = "http://ca.advfn.com/stock-market/" + pair[0] + "/" + pair[1] + "/financials"
      webscrape(url)
    end

    render :json => @portfolio_analyze
  end

  def webscrape(url)
    require 'open-uri'

    doc = Nokogiri::HTML(open(url))

    # The following code will get us all of the company specific data we need
    doc.css("table td").each do |i|
    
      if i.text == "Company Name: "
        @stock[:company_name] = i.next.text
      elsif i.text == "Industry Information: "
        @stock[:industry] = i.next.text.match(/[A-Z]+/).to_s
      elsif i.text == "PE Ratio - LTM"
        @stock[:p_e_ratio_LTM] = i.next.text.to_f
      elsif i.text == "Market Capitalisation"
        val = i.next.text
        @stock[:mkt_cap] = val.gsub(/[^\d\.]/, '').to_f * 1_000_000
        # Removed the following code since all values are in the million data type
        # if i.next.next.text == "mil"
        #   val = i.next.text
        #   @stock[:mkt_cap] = val.gsub(/[^\d\.]/, '').to_f * 1_000_000
        # end
      elsif i.text == "Enterprise Value (EV)/EBITDA"
        @stock[:ev_ebitda] = i.next.text.to_f
      elsif i.text == "Enterprise Value (EV)/Free Cash Flow"
        @stock[:ev_fcf] = i.next.text.to_f
      elsif i.text == "Price/Book Ratio - LTM"
        @stock[:p_b] = i.next.text.to_f
      elsif i.text == "Price/Free Cash Flow Ratio - LTM"
        @stock[:p_fcf] = i.next.text.to_f
      elsif i.text == "Return on Equity (ROE)"
        @stock[:roe] = i.next.text.to_f
      elsif i.text == "Return on Capital Invested (ROCI)"
        @stock[:roci] = i.next.text.to_f
      elsif i.text == "Return on Assets (ROA)"
        @stock[:roa] = i.next.text.to_f
      end
    end
    
    @portfolio_analyze.push(@stock)
  end
end
