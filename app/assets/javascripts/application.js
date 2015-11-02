// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$(function() {

  $('form').submit(function (event) {
    event.preventDefault();
    
    $.ajax({
      url: "portfolio/analyze",
      success: success,
      error: error,
      type: 'post',
      data: { 
        stocks: $('input[name="analyze-portfolio"]').val()},
      dataType: "json"
    })

    function success(results) {
      console.log(sortResults(results));
      debugger
    }

    function error() {
      alert("An error has occured with the API call."
        + "Please make sure all of the stocks listed have the correct exchange"
        + " and the correct ticker. Ex: exchange:ticker, NYSE:BBY, TSX:BMO")
    }

  });
});

function sortResults(results) {
  var ebitda_margin = [], ev_ebitda = [], ev_fcf =[], industry =[], mkt_cap =[];
  var net_profit_margin = [], p_b = [], p_e = [], p_fcf = [], roa = [], roci = [], roe = [];

  for (var i = 0; i < results.length; i++) {
    ebitda_margin.push(results[i]["ebitda_margin"]);
    ev_ebitda.push(results[i]["ev_ebitda"]);
    ev_fcf.push(results[i]["ev_fcf"]);
    industry.push(results[i]["industry"]);
    mkt_cap.push(results[i]["mkt_cap"]);
    net_profit_margin.push(results[i]["net_profit_margin"]);
    p_b.push(results[i]["p_b"]);
    p_e.push(results[i]["p_e_rtio_LTM"]);
    p_fcf.push(results[i]["p_fcf"]);
    roa.push(results[i]["roa"]);
    roci.push(results[i]["roci"]);
    roe.push(results[i]["roe"]);
  }

  return ebitda_margin, ev_ebitda, ev_fcf, industry, mkt_cap, net_profit_margin, p_b, p_e, p_fcf, roa, roci, roe
}

function calcAverages(results) {

}


















