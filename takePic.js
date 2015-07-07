//takePic.js

//this file is bundled and a dependancy: browserify takePic.js > takePicBundle.js
var MoveFile = require('./moveFile.js');

var takePic = {
	attachButtonHandler: function(){
		 $('#takePic').on( 'click' , function(e){
  			e.preventDefault();
  			//alert('hellow');
  			takePic.launchCamera();
 		});
	},
	launchCamera: function () {
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      		destinationType: Camera.DestinationType.FILE_URI });
    	
    	function onSuccess(imageURI) {
    		//hide div and show loading
    		$("#takePicBlurb").hide();
			$("#loading-box").show();
    	//img initially stored to tmp directory
    			steroids.logger.log('success');
        MoveFile.move(imageURI);
    }

    function onFail(message) {
        		steroids.logger.log('Failed because: ' + message);
    }
	}
};

module.exports = takePic;