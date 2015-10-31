require 'test_helper'

class StocksControllerTest < ActionController::TestCase
  setup do
    @stock = stocks(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:stocks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create stock" do
    assert_difference('Stock.count') do
      post :create, stock: { EV_to_EBITDA: @stock.EV_to_EBITDA, EV_to_FCF: @stock.EV_to_FCF, P_to_B: @stock.P_to_B, P_to_E: @stock.P_to_E, P_to_FCF: @stock.P_to_FCF, ROA: @stock.ROA, ROCI: @stock.ROCI, ROE: @stock.ROE, company_name: @stock.company_name, country: @stock.country, marketcap: @stock.marketcap, price: @stock.price, sector: @stock.sector, ticker_symbol: @stock.ticker_symbol }
    end

    assert_redirected_to stock_path(assigns(:stock))
  end

  test "should show stock" do
    get :show, id: @stock
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @stock
    assert_response :success
  end

  test "should update stock" do
    patch :update, id: @stock, stock: { EV_to_EBITDA: @stock.EV_to_EBITDA, EV_to_FCF: @stock.EV_to_FCF, P_to_B: @stock.P_to_B, P_to_E: @stock.P_to_E, P_to_FCF: @stock.P_to_FCF, ROA: @stock.ROA, ROCI: @stock.ROCI, ROE: @stock.ROE, company_name: @stock.company_name, country: @stock.country, marketcap: @stock.marketcap, price: @stock.price, sector: @stock.sector, ticker_symbol: @stock.ticker_symbol }
    assert_redirected_to stock_path(assigns(:stock))
  end

  test "should destroy stock" do
    assert_difference('Stock.count', -1) do
      delete :destroy, id: @stock
    end

    assert_redirected_to stocks_path
  end
end
