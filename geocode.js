function CityAutoSuggest(element, options){
    this.$element = $(element);
    this.init();
}

CityAutoSuggest.prototype = {
    init: function(){
        var self = this;
        this.$element.after("<span id='geoSuggestions'><ul></ul></span>");
        this.$suggestEl = $("#geoSuggestions ul");
        this.$element.keyup(function(){
            self.query();
        });
    },
    query: function(){
        var self = this;
        if(this.$element.val().length >= 3){
            var url = "http://ws.geonames.org/searchJSON?country=US&featureClass=P&name_startsWith="+
                this.$element.val().split(" ").join("+");
            jQuery.getJSON(url + "&callback=?", function (jsonData) {
                self.createSuggestions(jsonData);
            });
        }

    },
    createSuggestions: function(jsonData){
        var self = this;
        $.each(jsonData.geonames, function(i, city){
            if(i < 7){
                var el = $("<li>"+city.name +", "+city.adminCode1+"</li>");
                self.$suggestEl.append(el);
                el.click(function(el){
                    self.citySelected(this);
                });
            }
        });
    },
    citySelected: function(el){
        this.$element.val($(el).text())
    }

}

$.fn.citySuggest = function ( options ) {
    return this.each(function () {
        new CityAutoSuggest( this, options );
    });
}





/* old code
(function ($) {
    $.fn.googleGeoCode = function (options, f) {
        defaults = {
            responseElement: $('span#geocode-response')
        }
        var options = $.extend({}, defaults, options);

        return this.each(function () {
            formInput = $(this);
            formInput.keyup(function(){
                // Hide the result container by default
                $(options.responseElement).addClass('hide');

                var dataString = "address=" + $(formInput).val().split(" ").join("+") +
                    "&output=json&oe=utf8\&gl=us&sensor=false";
                var url = "https://maps.googleapis.com/maps/api/geocode/json?" +
                    dataString;
                jQuery.getJSON(url + "&callback=?", function (jsonData) {
                    console.log(jsonData);
                    //f.call(formInput, jsonData);
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
        });
    }
})(jQuery);

*/