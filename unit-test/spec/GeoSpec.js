describe("Results holder", function(){
	it("appends the result holder to the input", function(){
		var results = $("#geoSuggestions");
		expect(results.length).toBe(1);
	});

});

describe("city suggest", function(){
	beforeEach(function() {
		var val = "mad";
	    $('.textInput').val("").val(val);
	});

	it("should make an AJAX request to be made", function() {
	    spyOn($, "ajax");
	    var val = "mad";
	    $('.textInput').val(val).trigger('keyup');

	    expect($.ajax).toHaveBeenCalled();
	});

	it("should populate a drop down", function(){

		runs(function() {
			$('.textInput').trigger('keyup');
	    	flag = false;
	    	value = 0;
	    	console.log("trigger");
	    	setTimeout(function() {
	    		flag = true;
	    	}, 1500);
	    });

	    waitsFor(function() {
	      value++;
	      return flag;
	    }, "The Value should be incremented", 2000);

	    runs(function() {
	    	var results = $("#geoSuggestions ul li");
			expect(results.length).toBeGreaterThan(0);
	    });


	});

	it("clicking an options should change the value", function(){
		var city = $("#geoSuggestions ul li").first();
		city.trigger("click");
		expect($('.textInput').val()).toBe(city.text());
	});
});