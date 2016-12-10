(function()
{
  freeboard.loadDatasourcePlugin({
    "type_name"   : "my_datasource_plugin",
    "display_name": "Datasource Plugin Example",
    "description" : "Some sort of description <strong>with optional html!</strong>",
    "external_scripts" : [
      "http://mydomain.com/myscript1.js","http://mydomain.com/myscript2.js"
    ],
    "settings"    : [
      {
        "name"         : "first_name",
        "display_name" : "First Name",
        "type"         : "text",
        "default_value": "John",
        "description"  : "This is pretty self explanatory..."
      },
      {
        "name"        : "last_name",
        "display_name": "Last Name",
        "type"        : "calculated"
      },
      {
        "name"        : "is_human",
        "display_name": "I am human",https://www.dropbox.com/s/h16jyb8fgjy199i/plugin_example.js?dl=1?raw=1
        "type"        : "boolean"
      },
      {
        "name"        : "age",
        "display_name": "Your age",
        "type"        : "option",
        "options"     : [
          {
            "name" : "0-50",
            "value": "young"
          },
          {
            "name" : "51-100",
            "value": "old"
          }
        ]
      },
      {
        "name"        : "other",
        "display_name": "Other attributes",
        "type"        : "array",
        "settings"    : [
          {
            "name"        : "name",
            "display_name": "Name",
            "type"        : "text"
          },
          {
            "name"        : "value",
            "display_name": "Value",
            "type"        : "text"
          }
        ]
      },
      {
        "name"         : "refresh_time",
        "display_name" : "Refresh Time",
        "type"         : "text",
        "description"  : "In milliseconds",
        "default_value": 5000
      }
    ],

    newInstance(settings, newInstanceCallback, updateCallback)
    {
      newInstanceCallback(new myDatasourcePlugin(settings, updateCallback));
    }
  });
 
  var myDatasourcePlugin = function(settings, updateCallback)
  {
    var self = this;
    var currentSettings = settings;

    /* This is some function where I'll get my data from somewhere */
    function getData()
    {
      var newData = { hello : "world! it's " + new Date().toLocaleTimeString() }; // Just putting some sample data in for fun.

      /* Get my data from somewhere and populate newData with it... Probably a JSON API or something. */
      /* ... */
      updateCallback(newData);
    }

    var refreshTimer;

    function createRefreshTimer(interval)
    {
      if(refreshTimer)
      {
        clearInterval(refreshTimer);
      }

      refreshTimer = setInterval(function()
      {
        getData();
      }, interval);
    }

    self.onSettingsChanged = function(newSettings)
    {
      currentSettings = newSettings;
    }

    self.updateNow = function()
    {
      getData();
    }

    self.onDispose = function()
    {
      clearInterval(refreshTimer);
      refreshTimer = undefined;
    }

    createRefreshTimer(currentSettings.refresh_time);
  }


  freeboard.loadWidgetPlugin({
    "type_name"   : "gchart_plugin",
    "display_name": "Google Chart",
    "description" : "Some sort of description <strong>with optional html!</strong>",
    "external_scripts": [
      "https://www.gstatic.com/charts/loader.js"
    ],
    "fill_size" : true,
    "settings": [
            {
                "name": "html",
                "display_name": "HTML",
                "type": "calculated",
                "description": "Can be literal HTML, or javascript that outputs HTML."
            },
            {
                "name": "height",
                "display_name": "Height Blocks",
                "type": "number",
                "default_value": 4,
                "description": "A height block is around 60 pixels"
            }
    ],

    newInstance   : function(settings, newInstanceCallback)
    {
      newInstanceCallback(new myWidgetPlugin(settings));
    }
  });

  freeboard.addStyle('.html-widget', "white-space:normal;width:100%;height:100%");
  var myWidgetPlugin = function(settings)
  {
    var self = this;
    var currentSettings = settings;
    var htmlElement = $('<div class="html-widget"></div>');
    self.render = function(containerElement)
    {
      $(containerElement).append(htmlElement);
      google.charts.load('current', {'packages':['line']});

      // // Set a callback to run when the Google Visualization API is loaded.
      google.charts.setOnLoadCallback(drawChart);

      // var chartDiv = '<div id="chart_div" style="width: 900px; height: 500px"></div>';
      // $(containerElement).append(chartDiv);
      // htmlElement = $(chartDiv);
      // // Callback that creates and populates a data table,
      // // instantiates the pie chart, passes in the data and
      // // draws it.
      function drawChart() {
        var queryString = encodeURIComponent('SELECT A, B, C, D');

        var query = new google.visualization.Query(
            'https://docs.google.com/spreadsheets/d/1nRtKIxvjdZEqc1Lp0GER855Iqfz4NCBSd-TFbsOI7y0/gviz/tq?sheet=Sheet1' + queryString);
        query.send(handleSampleDataQueryResponse);
      }

      function handleSampleDataQueryResponse(response) {
        if (response.isError()) {
          alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
          return;
        }

        // var options = {
        //     title: 'Acceleration',
        //     curveType: 'function',
        //     legend: { position: 'bottom' }
        //   };
        var materialOptions = {
          chart: {
            title: 'Acceleration',
            width: 1200,
            height: 300
          },
          vAxis: {
            title: 'ms-2'
          },
          hAxis: {
            title: 'Time (s)',
//             viewWindow: {max: 1600},
            ticks: [0, 250, 500, 750, 1000, 1250, 1500]
          }
//           series: {
//             0: {color: 'blue'},
//             1: {color: 'red'},
//             2: {color: 'orange'},
//           },
//           legend: { maxLines: 3}  
        };

        var data = response.getDataTable();
        // var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        var chart = new google.charts.Line(containerElement);
        // chart.draw(data, materialOptions);
        chart.draw(data, google.charts.Line.convertOptions(materialOptions));
      }
    }

    self.getHeight = function()
    {
      return Number(currentSettings.height);
    }

    self.onSettingsChanged = function(newSettings)
    {
      currentSettings = newSettings;
    }
 
    self.onCalculatedValueChanged = function(settingName, newValue)
    {
      if (settingName == "html") {
        htmlElement.html(newValue);
      }
    }
 
    self.onDispose = function()
    {
    }
  }
}());
