//city-view-bundle.js
//this file is browserified for > city-view.js
var Spinner = require('spin.js');
var $ = require('jquery');
var SpinnerOptions = require('./spinnerOptions.js');
var Config = require('./config.js');
var Router = require('./router.js');
var Moment = require('moment');

var hotelView = {
	init:function(){
		var current_city_data = localStorage.getItem('current_city');
		current_city_data = JSON.parse(current_city_data);
		current_city_data = current_city_data.data;
		// var current_city = current_city_data.city;
		// alert(current_city);
		var lat = current_city_data.lat;
		var lon = current_city_data.lon;

		var key = localStorage.getItem("app-state");
        key = JSON.parse(key);
        key = key.data;
        key = key.private_key;
        // alert(key);
        var hotelId = localStorage.getItem('hotel_id');
        // alert(hotelId);
        // alert(queryDate);
        hotelView.getHotelData(hotelId, key);

        		$("#book-now").on("click",function() {
			var view = new supersonic.ui.View({
				location: "book-now.html",
				id: "book_now"
			});
			supersonic.ui.layers.push(view);
		});

    },
    getHotelData: function(hotelId, key){
    	var key = key;
    	var hotelId = hotelId;
    	var appConfig = Config;
    	var getHotelAjaxURL = appConfig.apiData.getHotelData;
    	var queryString = hotelId + '&key=' + key;
    	var url = getHotelAjaxURL + queryString;
    			// steroids.logger.log(url);

    	$.ajax({
			url: url,
			method: "get",
			success: function(data) {
				// alert('success');
				var hotelData = data;
				localStorage.setItem('hotel' , hotelData);
				hotelData=JSON.parse(data);
				// steroids.logger.log(hotelData);
				var hotelName = hotelData.name;
				supersonic.ui.navigationBar.update(hotelName);
				hotelView.renderHotelSlides(hotelData);
				// localStorage.setItem("hotel",JSON.stringify(hotel));
				//proceed rendering
			},
			error: function(error) {
				// alert('error');
				// steroids.logger.log(error);
			}
		});
    	

    },
    renderHotelSlides: function(hotelData){
    	//prep swiper

		$("#footer-button").show();

		var hotel = hotelData;
				// steroids.logger.log(hotel.images.sliderImages);
		var output='';
		// steroids.logger.log("hotel.images.sliderImages="+hotel.images.sliderImages);
		for(var i in hotel.images.sliderImages)
		{
			// steroids.logger.log("list_image="+hotel.images.sliderImages[i].list_image);
			output+='<div class="swiper-slide"><img src="'+hotel.images.sliderImages[i].list_image+'" class="hotel-slide-img"></div>';
		}

		$("#sliderImages").html(output);
		// steroids.logger.log(output);

		 
    	var mySwiper = new Swiper('.swiper-container',{
			mode:'horizontal',
			loop: true,
			autoplay:5000,
			speed:1000
		}); 

		//mySwiper.startAutoPlay(); 
		hotelView.renderHotel(hotel);
	},
renderHotel: function(hotel){
		        //date
        var date = localStorage.getItem('query-date');
        //alert(date);
        var hotel = hotel;
        		// steroids.logger.log(hotel);
		$("#hotel_name").html(hotel.name);
		// $("#hotel_style").html(hotel.hotel_style);
		$("#description").html(hotel.description);
		$("#address").html(hotel.address);
		$("#address2").html(hotel.city+", "+hotel.state + " &nbsp; " + hotel.zip);
		// $("#square_feet").html(hotel.square_feet);

		$("#check-in").html(hotel.check_in); //format_check_datetime
		$("#check-out").html(hotel.check_out);//format_check_datetime

		$("#phone").html(hotel.phone);
		$("#bar_description").html(hotel.bar_description);
		$("#restaurant_description").html(hotel.restaurant_description);
		$("#additional_info").html(hotel.additional_info);
		$("#pets_allowed").html(hotel.pets_allowed);
		$("#pets_allowed_description").html(hotel.pets_allowed_description);

		// $("#facebook").html(hotel.facebook);
		// $("#twitter").html(hotel.twitter);
		// $("#url").html(hotel.url);
		// $("#email").html(hotel.email);

		$("#number_of_rooms").html(hotel.number_of_rooms);
		$("#number_of_rooms_available").html(hotel.number_of_rooms_available);

		var i;

		/* get lowest charge. note: they are returned in lowest net_rate ASC order. */
		var charges=0;
		if(hotel.tickets!=undefined)
		{
			for(i in hotel.tickets)
			{
				if(hotel.tickets[i].ticket_date==date)
				{
					charges=hotel.tickets[i].net_rate;
					break;
				}
			}
		}
		$("#charges").html(" <span>"+charges+"</span> ");
		if(charges==0||hotel.number_of_rooms_available<=0) $("#footer-button").html("<p>No rooms currently available.</p>");

		if(hotel.amenities!=undefined)
		{
			output="";
			var a=hotel.amenities.split(",")
			for(i in a)
			{
				output+="<li>"+a[i]+"</li>";
			}	
			$("#hotel-amenities").html(output);
		}

		if(hotel.room_amenities!=undefined)
		{
			output="";
			var a=hotel.room_amenities.split(",")
			for(i in a)
			{
				output+="<li>"+a[i]+"</li>";
			}	
			$("#room-amenities").html(output);


		}

		if(hotel.perks!=undefined)
		{
			output="";
			var a=hotel.perks.split(",");
			for(i in a)
			{
				output+="<li>"+a[i]+"</li>";
			}	
			$("#perks").html(output);
		}

		if(hotel.rooms!=undefined)
		{
			output="";
			for(i in hotel.rooms)
			{
				output+="<li>"+hotel.rooms[i].description+" "+hotel.rooms[i].square_feet+"</li>";
			}
			$("#rooms").html(output);
		}
					/* careful a couple of these are almost duplicates such as Pets Allowed and Pets allowed*/
					/*test*/
			$(".amenities-section ul li").each(function(){

				var text = $(this).text();
				text == "Wifi" || text == "Complimentary Wifi" ?  $(this).prepend('<img src="images/icons/wifi@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Room Service" || text == "room service available" ? $(this).prepend('<img src="images/icons/room-service@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Pets allowed" || text == "Pets Allowed" ? $(this).prepend('<img src="images/icons/pets@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Complimentary self-parking" || text == "Valet Parking" || text == "Valet Parking Fee" ? $(this).prepend('<img src="images/icons/valet-parking@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Fitness Center" ? $(this).prepend('<img src="images/icons/fitness-center@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Indoor Pool" || text == "Outdoor Pool" ? $(this).prepend('<img src="images/icons/pool@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Hot Tub" ? $(this).prepend('<img src="images/icons/hot-tub@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Sauna" ? $(this).prepend('<img src="images/icons/sauna@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Beach Access" ? $(this).prepend('<img src="images/icons/beach@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Ski Access" ? $(this).prepend('<img src="images/icons/ski@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Spa Services Available" ? $(this).prepend('<img src="images/icons/spa@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Bar on Site" || text == "drinks served at beach club" ? $(this).prepend('<img src="images/icons/bar@2x.png" width="16" height="16" /> &nbsp;') : null;
				text == "Restaurant on Site" || text == "restaurant serves regional cuisine" ? $(this).prepend('<img src="images/icons/restaurant@2x.png" width="16" height="16" /> &nbsp;') : null;


			});
			/*end test*/

	}

}

document.addEventListener("deviceready", hotelView.init, false);