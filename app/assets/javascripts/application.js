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
      console.log(results);
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
  var p_b = [], p_e = [], p_fcf = [], roa = [], roci = [], roe = [];

  for (var i = 0; i < results.length; i++) {
    ebitda_margin
    ev_ebitda
    ev_fcf
    industry
    mkt_cap
    p_b
    p_e
    p_fcf
    roa
    roci
    roe  
  }


}

function calcAverages(results) {

}


















