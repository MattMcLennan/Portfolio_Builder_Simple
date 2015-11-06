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

      var ev_ebitda = [], ev_fcf =[], industry =[], mkt_cap =[];
      var p_b = [], p_e = [], p_fcf = [], roa = [], roci = [], roe = [];

      for (var i = 0; i < results.length; i++) {
        ev_ebitda.push(results[i]["ev_ebitda"]);
        ev_fcf.push(results[i]["ev_fcf"]);
        industry.push(results[i]["industry"]);
        mkt_cap.push(results[i]["mkt_cap"]);
        p_b.push(results[i]["p_b"]);
        p_e.push(results[i]["p_e_ratio_LTM"]);
        p_fcf.push(results[i]["p_fcf"]);
        roa.push(results[i]["roa"]);
        roci.push(results[i]["roci"]);
        roe.push(results[i]["roe"]);
      }

      // Used to check if any of the stocks entered do not exist
      for (var i = 0; i < ev_ebitda.length; i++) {
        if (ev_ebitda[i] === undefined) {
          return error();
        }
      }

      // These values will return the averages for their respective data calls
      var ev_ebitda_avg, ev_fcf_avg, mkt_cap_avg;
      var p_b_avg, p_e_avg, p_fcf_avg, roa_avg, roci_avg, roe_avg;

      ev_ebitda_avg = calcAverages(ev_ebitda);
      ev_fcf_avg = calcAverages(ev_fcf);
      p_b_avg = calcAverages(p_b);
      p_e_avg = calcAverages(p_e);
      p_fcf_avg = calcAverages(p_fcf);
      roa_avg = calcAverages(roa);
      roci_avg = calcAverages(roci);
      roe_avg = calcAverages(roe);

      sectorChart(industry);
      mktCapCharts(mkt_cap);
      valuationCharts(p_b_avg, p_e_avg, p_fcf_avg, ev_fcf_avg, ev_ebitda_avg);
      returnRatioCharts(roa_avg, roci_avg, roe_avg);
      $('.charts').css("display","block");

    }

    function error() {
      alert("An error has occured with the API call."
        + "Please make sure all of the stocks listed have the correct exchange"
        + " and the correct ticker. Ex: exchange:ticker, NYSE:BBY, TSX:BMO")
    }

  });
});


function calcAverages(fundamental_data) {
  var total = 0, zeros = 0;

  for (var i = 0; i < fundamental_data.length; i++) {
    total += fundamental_data[i];
    if (fundamental_data[i] === 0) {
      zeros += 1;
    }
  }

  return total / (fundamental_data.length - zeros);
}

function mktCapCharts(mkt_cap) {
  darkTheme();

  var megaCap=[], largeCap=[], midCap=[], smallCap=[], microCap=[], nanoCap=[];

  // Gathering different market cap buckets
  for (var i = 0; i < mkt_cap.length; i++) {
    if (mkt_cap[i] >= 200000000000) {
      megaCap.push(mkt_cap[i]);
    } else if (mkt_cap[i] >= 10000000000) {
      largeCap.push(mkt_cap[i]);
    } else if (mkt_cap[i] >= 2000000000) {
      midCap.push(mkt_cap[i]);
    } else if (mkt_cap[i] >= 300000000) {
      smallCap.push(mkt_cap[i]);
    } else if (mkt_cap[i] >= 50000000) {
      microCap.push(mkt_cap[i]);
    } else {
      nanoCap.push(mkt_cap[i]);
    }
  }

  $('#container-mktCap').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Portfolio Marketcap Profile'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: false
        },
        showInLegend: true
      }
    },
    series: [{
      name: "Marketcap",
      colorByPoint: true,
      data: [{
        name: "Mega Cap",
        y: (megaCap.length / mkt_cap.length) * 100
      }, {
        name: "Large Cap",
        y: (largeCap.length / mkt_cap.length) * 100
      }, {
        name: "Mid Cap",
        y: (midCap.length / mkt_cap.length) * 100
      }, {
        name: "Small Cap",
        y: (smallCap.length / mkt_cap.length) * 100
      }, {
        name: "Micro Cap",
        y: (microCap.length / mkt_cap.length) * 100      
      }, {
        name: "Nano Cap",
        y: (nanoCap.length / mkt_cap.length) * 100     
      }]
    }]
  });
}


function sectorChart(industry) {
  var sectorList = {};

  for (var i = 0; i < industry.length; i++) {
    if (industry[i] in sectorList) {
      sectorList[String(industry[i])] += 1;
    } else {
      sectorList[String(industry[i])] = 1;
    }
  }

  var data = [];

  for (sector in sectorList) {
    data.push({ 
      name: String(sector),
      y: (sectorList[sector]/industry.length) * 100
    });
  }

  darkTheme();

  // Radialize the colors
  Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
    return {
      radialGradient: {
        cx: 0.5,
        cy: 0.3,
        r: 0.7
      },
      stops: [
        [0, color],
        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
      ]
    };
  });

  // Build the chart
  $('#container-sector').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Portfolio Sector Exposure'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          },
          connectorColor: 'silver'
        }
      }
    },
    series: [{
      name: "Marketcap",
      colorByPoint: true,
      data: data
    }]
  });
} 

function darkTheme() {
  /**
   * Dark theme for Highcharts JS
   * @author Torstein Honsi
   */

  // Load the fonts
  Highcharts.createElement('link', {
     href: '//fonts.googleapis.com/css?family=Unica+One',
     rel: 'stylesheet',
     type: 'text/css'
  }, null, document.getElementsByTagName('head')[0]);

  Highcharts.theme = {
     colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
     chart: {
        backgroundColor: {
           linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
           stops: [
              [0, '#2a2a2b'],
              [1, '#3e3e40']
           ]
        },
        style: {
           fontFamily: "'Unica One', sans-serif"
        },
        plotBorderColor: '#606063'
     },
     title: {
        style: {
           color: '#E0E0E3',
           textTransform: 'uppercase',
           fontSize: '20px'
        }
     },
     subtitle: {
        style: {
           color: '#E0E0E3',
           textTransform: 'uppercase'
        }
     },
     xAxis: {
        gridLineColor: '#707073',
        labels: {
           style: {
              color: '#E0E0E3'
           }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
           style: {
              color: '#A0A0A3'

           }
        }
     },
     yAxis: {
        gridLineColor: '#707073',
        labels: {
           style: {
              color: '#E0E0E3'
           }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
           style: {
              color: '#A0A0A3'
           }
        }
     },
     tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
           color: '#F0F0F0'
        }
     },
     plotOptions: {
        series: {
           dataLabels: {
              color: '#B0B0B3'
           },
           marker: {
              lineColor: '#333'
           }
        },
        boxplot: {
           fillColor: '#505053'
        },
        candlestick: {
           lineColor: 'white'
        },
        errorbar: {
           color: 'white'
        }
     },
     legend: {
        itemStyle: {
           color: '#E0E0E3'
        },
        itemHoverStyle: {
           color: '#FFF'
        },
        itemHiddenStyle: {
           color: '#606063'
        }
     },
     credits: {
        enabled: false,
        style: {
           color: '#666'
        }
     },
     labels: {
        style: {
           color: '#707073'
        }
     },

     drilldown: {
        activeAxisLabelStyle: {
           color: '#F0F0F3'
        },
        activeDataLabelStyle: {
           color: '#F0F0F3'
        }
     },

     navigation: {
        buttonOptions: {
           symbolStroke: '#DDDDDD',
           theme: {
              fill: '#505053'
           }
        }
     },

     // scroll charts
     rangeSelector: {
        buttonTheme: {
           fill: '#505053',
           stroke: '#000000',
           style: {
              color: '#CCC'
           },
           states: {
              hover: {
                 fill: '#707073',
                 stroke: '#000000',
                 style: {
                    color: 'white'
                 }
              },
              select: {
                 fill: '#000003',
                 stroke: '#000000',
                 style: {
                    color: 'white'
                 }
              }
           }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
           backgroundColor: '#333',
           color: 'silver'
        },
        labelStyle: {
           color: 'silver'
        }
     },

     navigator: {
        handles: {
           backgroundColor: '#666',
           borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
           color: '#7798BF',
           lineColor: '#A6C7ED'
        },
        xAxis: {
           gridLineColor: '#505053'
        }
     },

     scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
     },

     // special colors for some of the
     legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
     background2: '#505053',
     dataLabelsColor: '#B0B0B3',
     textColor: '#C0C0C0',
     contrastTextColor: '#F0F0F3',
     maskColor: 'rgba(255,255,255,0.3)'
  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);
}

function valuationCharts(p_b_avg, p_e_avg, p_fcf_avg, ev_fcf_avg, ev_ebitda_avg) {
  darkTheme();
  // Create the chart
  $('#container-valuation').highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Valuation Ratios - Trailing Twelve Months'
    },
    subtitle: {
      text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Average Portfolio Valuation Metric'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [{
      name: "Valuation",
      colorByPoint: true,
      data: [{
        name: "Average P/B Ratio",
        y: p_b_avg
      }, {
        name: "Average P/E Ratio",
        y: p_e_avg
      }, {
        name: "Average P/FCF Ratio",
        y: p_fcf_avg
      }, {
        name: "Average EV/FCF Ratio",
        y: ev_fcf_avg
      }, {
        name: "Average EV/EBITDA Ratio",
        y: ev_ebitda_avg
      }]
    }]
  });
}

function returnRatioCharts(roa_avg, roci_avg, roe_avg) {
  darkTheme();
  // Create the chart
  $('#container-returnRatio').highcharts({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Financial Ratios - Trailing Twelve Months'
    },
    subtitle: {
      text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Average Financial Ratio(%)'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [{
      name: "Ratio",
      colorByPoint: true,
      data: [{
        name: "Average ROA",
        y: roa_avg
      }, {
        name: "Average ROCI",
        y: roci_avg
      }, {
        name: "Average ROE",
        y: roe_avg
      }]
    }]
  });
}
