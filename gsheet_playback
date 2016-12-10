var gsheetPlaybackDatasource = function (settings, updateCallback) {
		var self = this;
		var currentSettings = settings;
		var currentDataset = [];
		var currentIndex = 0;
		var currentTimeout;
        
        function convertToJSON(value) {
            var stArray = value.split(', ');
            var obj = {};
            for (var i in stArray) {
                var sig = stArray[i].split(": ");
                obj[sig[0]] = sig[1];
            }
            return obj;
        }

		function moveNext() {
			if (currentDataset.length > 0) {
				if (currentIndex < currentDataset.length) {
					currentDataset[currentIndex]["content"]["$t"] = convertToJSON(currentDataset[currentIndex]["content"]["$t"]);
					updateCallback(currentDataset[currentIndex]);
					currentIndex++;
				}

				if (currentIndex >= currentDataset.length && currentSettings.loop) {
					currentIndex = 0;
				}

				if (currentIndex < currentDataset.length) {
					currentTimeout = setTimeout(moveNext, currentSettings.refresh * 1000);
				}
			}
			else {
				updateCallback({});
			}
		}

		function stopTimeout() {
			currentDataset = [];
			currentIndex = 0;

			if (currentTimeout) {
				clearTimeout(currentTimeout);
				currentTimeout = null;
			}
		}

		this.updateNow = function () {
			stopTimeout();
			var currUrl = "https://thingproxy.freeboard.io/fetch/https://spreadsheets.google.com/feeds/list/"+currentSettings.sheet_key+"/"+currentSettings.worksheet_id+"/public/basic?alt=json";
			$.ajax({
				url: currUrl,
				dataType: (currentSettings.is_jsonp) ? "JSONP" : "JSON",
				success: function (data) {
					data = data.feed.entry;
					if (_.isArray(data)) {
						currentDataset = data;
						console.log(currentDataset);
					}
					else {
						currentDataset = [];
					}
					currentIndex = 0;
					moveNext();
				},
				error: function (xhr, status, error) {
				}
			});
		}

		this.onDispose = function () {
			stopTimeout();
		}

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			self.updateNow();
		}
	};

	freeboard.loadDatasourcePlugin({
		"type_name": "gsheetplayback",
		"display_name": "Google Sheet Playback",
		"settings": [
			{
				"name": "sheet_key",
				"display_name": "Sheet Ket",
				"type": "text",
				"description": ""
			},
			{
			    "name":"worksheet_id",
			    "display_name":"Worksheet ID",
			    "type":"text",
			    "default_value":"default"
			},
			{
				name: "is_jsonp",
				display_name: "Is JSONP",
				type: "boolean",
				"default_value":false
			},
			{
				"name": "loop",
				"display_name": "Loop",
				"type": "boolean",
				"description": "Rewind and loop when finished"
			},
			{
				"name": "refresh",
				"display_name": "Refresh Every",
				"type": "number",
				"suffix": "seconds",
				"default_value": 5
			}
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new gsheetPlaybackDatasource(settings, updateCallback));
		}
	});
