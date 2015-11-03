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
  sectorChart();
  mktCapCharts();
  valuationCharts();
  marginCharts();
  returnRatioCharts();

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
        p_e.push(results[i]["p_e_ratio_LTM"]);
        p_fcf.push(results[i]["p_fcf"]);
        roa.push(results[i]["roa"]);
        roci.push(results[i]["roci"]);
        roe.push(results[i]["roe"]);
      }

      // These values will return the averages for their respective data calls
      var ebitda_margin_avg, ev_ebitda_avg, ev_fcf_avg, mkt_cap_avg;
      var net_profit_margin_avg, p_b_avg, p_e_avg, p_fcf_avg, roa_avg, roci_avg, roe_avg;

      ebitda_margin_avg = calcAverages(ebitda_margin);
      ev_ebitda_avg = calcAverages(ev_ebitda);
      net_profit_margin_avg = calcAverages(net_profit_margin);
      ev_fcf_avg = calcAverages(ev_fcf);
      p_b_avg = calcAverages(p_b);
      p_e_avg = calcAverages(p_e);
      p_fcf_avg = calcAverages(p_fcf);
      roa_avg = calcAverages(roa);
      roci_avg = calcAverages(roci);
      roe_avg = calcAverages(roe);

      debugger
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

function sectorChart() {
  darkTheme();

  $('#container-sector').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Browser market shares January, 2015 to May, 2015'
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
      name: "Brands",
      colorByPoint: true,
      data: [{
        name: "Microsoft Internet Explorer",
        y: 56.33
      }, {
        name: "Chrome",
        y: 24.03,
        sliced: true,
        selected: true
      }, {
        name: "Firefox",
        y: 10.38
      }, {
        name: "Safari",
        y: 4.77
      }, {
        name: "Opera",
        y: 0.91
      }, {
          name: "Proprietary or Undetectable",
          y: 0.2
        }]
    }]
  });
}

function mktCapCharts() {
  darkTheme();

  // Radialize the colors
      Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
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
      $('#container-mktCap').highcharts({
          chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie'
          },
          title: {
              text: 'Browser market shares. January, 2015 to May, 2015'
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
              name: "Brands",
              data: [
                  {name: "Microsoft Internet Explorer", y: 56.33},
                  {
                      name: "Chrome",
                      y: 24.03,
                      sliced: true,
                      selected: true
                  },
                  {name: "Firefox", y: 10.38},
                  {name: "Safari", y: 4.77}, {name: "Opera", y: 0.91},
                  {name: "Proprietary or Undetectable", y: 0.2}
              ]
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

function valuationCharts() {
  // Create the chart
     $('#container-valuation').highcharts({
         chart: {
             type: 'column'
         },
         title: {
             text: 'Browser market shares. January, 2015 to May, 2015'
         },
         subtitle: {
             text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
         },
         xAxis: {
             type: 'category'
         },
         yAxis: {
             title: {
                 text: 'Total percent market share'
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
             name: "Brands",
             colorByPoint: true,
             data: [{
                 name: "Microsoft Internet Explorer",
                 y: 56.33,
                 drilldown: "Microsoft Internet Explorer"
             }, {
                 name: "Chrome",
                 y: 24.03,
                 drilldown: "Chrome"
             }, {
                 name: "Firefox",
                 y: 10.38,
                 drilldown: "Firefox"
             }, {
                 name: "Safari",
                 y: 4.77,
                 drilldown: "Safari"
             }, {
                 name: "Opera",
                 y: 0.91,
                 drilldown: "Opera"
             }, {
                 name: "Proprietary or Undetectable",
                 y: 0.2,
                 drilldown: null
             }]
         }],
         drilldown: {
             series: [{
                 name: "Microsoft Internet Explorer",
                 id: "Microsoft Internet Explorer",
                 data: [
                     [
                         "v11.0",
                         24.13
                     ],
                     [
                         "v8.0",
                         17.2
                     ],
                     [
                         "v9.0",
                         8.11
                     ],
                     [
                         "v10.0",
                         5.33
                     ],
                     [
                         "v6.0",
                         1.06
                     ],
                     [
                         "v7.0",
                         0.5
                     ]
                 ]
             }, {
                 name: "Chrome",
                 id: "Chrome",
                 data: [
                     [
                         "v40.0",
                         5
                     ],
                     [
                         "v41.0",
                         4.32
                     ],
                     [
                         "v42.0",
                         3.68
                     ],
                     [
                         "v39.0",
                         2.96
                     ],
                     [
                         "v36.0",
                         2.53
                     ],
                     [
                         "v43.0",
                         1.45
                     ],
                     [
                         "v31.0",
                         1.24
                     ],
                     [
                         "v35.0",
                         0.85
                     ],
                     [
                         "v38.0",
                         0.6
                     ],
                     [
                         "v32.0",
                         0.55
                     ],
                     [
                         "v37.0",
                         0.38
                     ],
                     [
                         "v33.0",
                         0.19
                     ],
                     [
                         "v34.0",
                         0.14
                     ],
                     [
                         "v30.0",
                         0.14
                     ]
                 ]
             }, {
                 name: "Firefox",
                 id: "Firefox",
                 data: [
                     [
                         "v35",
                         2.76
                     ],
                     [
                         "v36",
                         2.32
                     ],
                     [
                         "v37",
                         2.31
                     ],
                     [
                         "v34",
                         1.27
                     ],
                     [
                         "v38",
                         1.02
                     ],
                     [
                         "v31",
                         0.33
                     ],
                     [
                         "v33",
                         0.22
                     ],
                     [
                         "v32",
                         0.15
                     ]
                 ]
             }, {
                 name: "Safari",
                 id: "Safari",
                 data: [
                     [
                         "v8.0",
                         2.56
                     ],
                     [
                         "v7.1",
                         0.77
                     ],
                     [
                         "v5.1",
                         0.42
                     ],
                     [
                         "v5.0",
                         0.3
                     ],
                     [
                         "v6.1",
                         0.29
                     ],
                     [
                         "v7.0",
                         0.26
                     ],
                     [
                         "v6.2",
                         0.17
                     ]
                 ]
             }, {
                 name: "Opera",
                 id: "Opera",
                 data: [
                     [
                         "v12.x",
                         0.34
                     ],
                     [
                         "v28",
                         0.24
                     ],
                     [
                         "v27",
                         0.17
                     ],
                     [
                         "v29",
                         0.16
                     ]
                 ]
             }]
         }
     });
}

function marginCharts() {
  // Create the chart
     $('#container-margin').highcharts({
         chart: {
             type: 'column'
         },
         title: {
             text: 'Browser market shares. January, 2015 to May, 2015'
         },
         subtitle: {
             text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
         },
         xAxis: {
             type: 'category'
         },
         yAxis: {
             title: {
                 text: 'Total percent market share'
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
             name: "Brands",
             colorByPoint: true,
             data: [{
                 name: "Microsoft Internet Explorer",
                 y: 56.33,
                 drilldown: "Microsoft Internet Explorer"
             }, {
                 name: "Chrome",
                 y: 24.03,
                 drilldown: "Chrome"
             }, {
                 name: "Firefox",
                 y: 10.38,
                 drilldown: "Firefox"
             }, {
                 name: "Safari",
                 y: 4.77,
                 drilldown: "Safari"
             }, {
                 name: "Opera",
                 y: 0.91,
                 drilldown: "Opera"
             }, {
                 name: "Proprietary or Undetectable",
                 y: 0.2,
                 drilldown: null
             }]
         }],
         drilldown: {
             series: [{
                 name: "Microsoft Internet Explorer",
                 id: "Microsoft Internet Explorer",
                 data: [
                     [
                         "v11.0",
                         24.13
                     ],
                     [
                         "v8.0",
                         17.2
                     ],
                     [
                         "v9.0",
                         8.11
                     ],
                     [
                         "v10.0",
                         5.33
                     ],
                     [
                         "v6.0",
                         1.06
                     ],
                     [
                         "v7.0",
                         0.5
                     ]
                 ]
             }, {
                 name: "Chrome",
                 id: "Chrome",
                 data: [
                     [
                         "v40.0",
                         5
                     ],
                     [
                         "v41.0",
                         4.32
                     ],
                     [
                         "v42.0",
                         3.68
                     ],
                     [
                         "v39.0",
                         2.96
                     ],
                     [
                         "v36.0",
                         2.53
                     ],
                     [
                         "v43.0",
                         1.45
                     ],
                     [
                         "v31.0",
                         1.24
                     ],
                     [
                         "v35.0",
                         0.85
                     ],
                     [
                         "v38.0",
                         0.6
                     ],
                     [
                         "v32.0",
                         0.55
                     ],
                     [
                         "v37.0",
                         0.38
                     ],
                     [
                         "v33.0",
                         0.19
                     ],
                     [
                         "v34.0",
                         0.14
                     ],
                     [
                         "v30.0",
                         0.14
                     ]
                 ]
             }, {
                 name: "Firefox",
                 id: "Firefox",
                 data: [
                     [
                         "v35",
                         2.76
                     ],
                     [
                         "v36",
                         2.32
                     ],
                     [
                         "v37",
                         2.31
                     ],
                     [
                         "v34",
                         1.27
                     ],
                     [
                         "v38",
                         1.02
                     ],
                     [
                         "v31",
                         0.33
                     ],
                     [
                         "v33",
                         0.22
                     ],
                     [
                         "v32",
                         0.15
                     ]
                 ]
             }, {
                 name: "Safari",
                 id: "Safari",
                 data: [
                     [
                         "v8.0",
                         2.56
                     ],
                     [
                         "v7.1",
                         0.77
                     ],
                     [
                         "v5.1",
                         0.42
                     ],
                     [
                         "v5.0",
                         0.3
                     ],
                     [
                         "v6.1",
                         0.29
                     ],
                     [
                         "v7.0",
                         0.26
                     ],
                     [
                         "v6.2",
                         0.17
                     ]
                 ]
             }, {
                 name: "Opera",
                 id: "Opera",
                 data: [
                     [
                         "v12.x",
                         0.34
                     ],
                     [
                         "v28",
                         0.24
                     ],
                     [
                         "v27",
                         0.17
                     ],
                     [
                         "v29",
                         0.16
                     ]
                 ]
             }]
         }
     });
}

function returnRatioCharts() {
  // Create the chart
     $('#container-returnRatio').highcharts({
         chart: {
             type: 'column'
         },
         title: {
             text: 'Browser market shares. January, 2015 to May, 2015'
         },
         subtitle: {
             text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
         },
         xAxis: {
             type: 'category'
         },
         yAxis: {
             title: {
                 text: 'Total percent market share'
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
             name: "Brands",
             colorByPoint: true,
             data: [{
                 name: "Microsoft Internet Explorer",
                 y: 56.33,
                 drilldown: "Microsoft Internet Explorer"
             }, {
                 name: "Chrome",
                 y: 24.03,
                 drilldown: "Chrome"
             }, {
                 name: "Firefox",
                 y: 10.38,
                 drilldown: "Firefox"
             }, {
                 name: "Safari",
                 y: 4.77,
                 drilldown: "Safari"
             }, {
                 name: "Opera",
                 y: 0.91,
                 drilldown: "Opera"
             }, {
                 name: "Proprietary or Undetectable",
                 y: 0.2,
                 drilldown: null
             }]
         }],
         drilldown: {
             series: [{
                 name: "Microsoft Internet Explorer",
                 id: "Microsoft Internet Explorer",
                 data: [
                     [
                         "v11.0",
                         24.13
                     ],
                     [
                         "v8.0",
                         17.2
                     ],
                     [
                         "v9.0",
                         8.11
                     ],
                     [
                         "v10.0",
                         5.33
                     ],
                     [
                         "v6.0",
                         1.06
                     ],
                     [
                         "v7.0",
                         0.5
                     ]
                 ]
             }, {
                 name: "Chrome",
                 id: "Chrome",
                 data: [
                     [
                         "v40.0",
                         5
                     ],
                     [
                         "v41.0",
                         4.32
                     ],
                     [
                         "v42.0",
                         3.68
                     ],
                     [
                         "v39.0",
                         2.96
                     ],
                     [
                         "v36.0",
                         2.53
                     ],
                     [
                         "v43.0",
                         1.45
                     ],
                     [
                         "v31.0",
                         1.24
                     ],
                     [
                         "v35.0",
                         0.85
                     ],
                     [
                         "v38.0",
                         0.6
                     ],
                     [
                         "v32.0",
                         0.55
                     ],
                     [
                         "v37.0",
                         0.38
                     ],
                     [
                         "v33.0",
                         0.19
                     ],
                     [
                         "v34.0",
                         0.14
                     ],
                     [
                         "v30.0",
                         0.14
                     ]
                 ]
             }, {
                 name: "Firefox",
                 id: "Firefox",
                 data: [
                     [
                         "v35",
                         2.76
                     ],
                     [
                         "v36",
                         2.32
                     ],
                     [
                         "v37",
                         2.31
                     ],
                     [
                         "v34",
                         1.27
                     ],
                     [
                         "v38",
                         1.02
                     ],
                     [
                         "v31",
                         0.33
                     ],
                     [
                         "v33",
                         0.22
                     ],
                     [
                         "v32",
                         0.15
                     ]
                 ]
             }, {
                 name: "Safari",
                 id: "Safari",
                 data: [
                     [
                         "v8.0",
                         2.56
                     ],
                     [
                         "v7.1",
                         0.77
                     ],
                     [
                         "v5.1",
                         0.42
                     ],
                     [
                         "v5.0",
                         0.3
                     ],
                     [
                         "v6.1",
                         0.29
                     ],
                     [
                         "v7.0",
                         0.26
                     ],
                     [
                         "v6.2",
                         0.17
                     ]
                 ]
             }, {
                 name: "Opera",
                 id: "Opera",
                 data: [
                     [
                         "v12.x",
                         0.34
                     ],
                     [
                         "v28",
                         0.24
                     ],
                     [
                         "v27",
                         0.17
                     ],
                     [
                         "v29",
                         0.16
                     ]
                 ]
             }]
         }
     });
}












