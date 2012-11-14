(function ($) {
    $.fn.googleGeoCode = function (options, f) {
        defaults = {
            responseElement: $('span#geocode-response')
        }
        var options = $.extend({}, defaults, options);

        return this.each(function () {
            formInput = this;
            // Hide the result container by default
            $(options.responseElement).addClass('hide');

            var dataString = "q=" + $(formInput).val().split(" ").join("+") + "&output=json&oe=utf8\&gl=us&sensor=false&key=" + options.mapKey;
            var url = "http://maps.google.com/maps/geo?" + dataString;
            jQuery.getJSON(url + "&callback=?", function (jsonData) {
                if (jsonData.Placemark && jsonData.Placemark.length == 1) { // ...... If there's only one result,
                    if (jsonData.Placemark[0].AddressDetails.Country.CountryName && jsonData.Placemark[0].AddressDetails.Country.CountryName == "USA") {
                        assignValue(jsonData.Placemark[0].address); // .... assign it to the input box.
                    }
                } else if (jsonData.Placemark && jsonData.Placemark.length > 1) { // ...... Otherwise, 
                    options.responseElement.html('<ul id="results"><li class="error">Did you mean:</li></ul>'); // .... create a list for the multiple results.
                    jQuery.each(jsonData.Placemark, function (i, result) { // .... For each placemark in the JSON array, we pass its index (i) and value (result),
                        if (jsonData.Placemark[0].AddressDetails.Country.CountryName && jsonData.Placemark[0].AddressDetails.Country.CountryName == "USA") {
                            $('ul#results').append('<li class="result">' + result.address + '</li>'); // and then append an item to the results list.
                        }
                    });
                    options.responseElement.removeClass("hide"); //...... Then, show the list after it's been populated.
                }
                f.call(formInput, jsonData);
            });

            // Helper function that assigns a value to the target text input box
            function assignValue(value) {
                var splitAddress = value.split(',');
                if (splitAddress[1].split(" ")) {
                    var zipcode = splitAddress[1].split(" ")[2];
                }
                if (zipcode) {} else {
                    $(formInput).val(splitAddress[0] + "," + splitAddress[1]);
                }
                $(options.responseElement).addClass('hide');
            }

            $('ul#results li.result').live('click', function () {
                var thisValue = $(this).text();
                assignValue(thisValue);
                $('ul#results').remove();
                return false;
            });
        });
    }
})(jQuery);