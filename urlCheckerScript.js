function homeScreenUrlForceAddressCheck() {	
		/*
		//	currently this is targeting the home page. different url's 
		//	would be used to provide override for
		//	different categories
		*/
	if ( window.location.pathname === '/results/' ) {
		var fullUrl = window.location.href;
		/*	
		//	the equal character is not present in the gmw_address key of the
		//	query parameter
		//	so we search for that string to determine whether or not we have an
		//	'active_location_search'
		*/
		var queryValidAddressURL = 'gmw_address%5B0%5D=';
		//search for queryValidAddressURL match
		if ( fullUrl.indexOf(queryValidAddressURL)> -1  ) {
			localStorage.setItem('active_location_search_url' , fullUrl );
			return;
		} else {
			var active_location_search_url = localStorage.getItem('active_location_search_url');
			$(".results-count-wrapper").prepend('<p>Finding new deals...</p>');
			location.replace(active_location_search_url);
		}
	}
}

homeScreenUrlForceAddressCheck();