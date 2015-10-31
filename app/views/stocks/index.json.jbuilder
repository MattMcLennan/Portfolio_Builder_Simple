json.array!(@stocks) do |stock|
  json.extract! stock, :id, :price, :EV_to_EBITDA, :P_to_E, :P_to_B, :P_to_FCF, :marketcap, :ROE, :ROA, :ROCI, :EV_to_FCF, :country, :sector, :company_name, :ticker_symbol
  json.url stock_url(stock, format: :json)
end
