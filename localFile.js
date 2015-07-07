//localFileUtil.js
var localFileUtil = {
	attachEventHandlers: function(){
		//when click on folder pass folder to next method
	},
	renderFolderView: function(folder){
		var _folder = folder;
		// $("#folderName").append(_folder);
		if( localStorage.getItem( 'savedImages' ) !== null ) {
			var images = localStorage.getItem( 'savedImages' );
			images = JSON.parse(images);
			images = images.data;

			for( var i in images ){
				if( images[i].folder === folder ){
					localFileUtil.renderImageItem(images[i]);
				}
			}
		}
	},
	renderImageItem: function(image){
				steroids.logger.log('render image');
						steroids.logger.log(image);
		var itemName = '<p>' + image.imageName + '</p>';
		var itemPath = image.fullPath;
		var resolveFsPath = image.resolveFsPath;

		var image = '<img src="' + itemPath + '" class="list-image" width="160" height="200" />'; 

		var element = 	  '<div class="card">' 
						+ '<div class="item">'
						+  itemName
						+ image
						+'</div>'
						+ '<div class="item item-divider">'
    					+ '<button type="button" class="btn" data-action="deleteFile" data-path="' + resolveFsPath + '" > Delete </button>'
    					+ '<button type="button" class="btn btn-primary btn-lg" data-action="emailFile" data-path="' + resolveFsPath + '" > Email </button>'
  						+ '</div>'
						+ '</div>';

		$("#imageList").append(element);
		var fullPath;
		$(".btn[data-action='deleteFile']").on( 'click' , function(){
			fullPath = $(this).attr("data-path");
			localFileUtil.deleteFile(fullPath);
		});
		
		$(".btn[data-action='emailFile']").on( 'click' , function(){
			fullPath = $(this).attr("data-path");
			
			$("#emailSubjectToModal").modal({show:true});

			$("#sendFinalEmail").on( 'click' , function(){
				var fname = $("#fname").val();
				var lname = $("#lname").val();
				var subject = '' + lname + ', ' + fname;
				var recipient = $("#email").val();

				var mailOptions = {};
				mailOptions.subject = subject;
				mailOptions.recipient = recipient;
				mailOptions.fullPath = fullPath;
				$(this).after('<i class="icon super-loading">Loading please wait...</i>');
				$(this).remove();
				localFileUtil.emailFile(mailOptions);
			});
		});
			//attach click handler to email to send file
			//attach delete handler to delete file

		//append the image to the list so it can be clicked to be previewed and sent
		//use the full path to trigger the file system access - once located will be transformed
		//to data uri and sent to node server for email
		//pop up modal will ask for the dr office email address to which the file will be sent
	},
	emailFile: function(mailOptions){
		var _fullPath = mailOptions.fullPath;
		var _subject = mailOptions.subject;
		var _recipient = mailOptions.recipient;

		var success = function(file){


			var _file = file;

					var fail = function(error){
					steroids.logger.log(error);
		}

		var win = function(file){
        steroids.logger.log('got file');

        var fileReader = new FileReader();  

        fileReader.onloadend = function () {

        steroids.logger.log('read file');
        var dataURLPayload = fileReader.result;
        //steroids.logger.log(dataURLPayload.length);
        dataURLPayload = {data:dataURLPayload, recipient: _recipient, subject:_subject};
        		    	$.ajax({
 						url: /* URL ENDPOINT */,
 						type:'post',
 						data:dataURLPayload,
 						success: function(data){
 									steroids.logger.log(data);
 										alert('Your email has been sent.');
										$("#emailSubjectToModal").modal({show:false});
										var route = 'home.html';
										   	var view = new supersonic.ui.View(route);
		supersonic.ui.layers.push(view);
 									//let user know
 						},
 						error: function(err){
								steroids.logger.log(err);
								alert('There was an error and your e-mail was unable to be processed Please check your network connection and try again.');
								//let user know
								$("#emailSubjectToModal").modal({show:false});
								var route = 'home.html';
								   	var view = new supersonic.ui.View(route);
		supersonic.ui.layers.push(view);
 				}
  				});

            }
            fileReader.readAsDataURL(file);
        };

        _file.file(win, fail);


		};

		var err = function(err){
			alert('resolveFSerr')
		};
		//var _file =  'file:///var/mobile/Containers/Data/Application/3014E737-88AB-4F9C-B10F-5E5CE1E3421B/Documents/health_files/health_filel94u17866';
		window.resolveLocalFileSystemURI(_fullPath, success, err);




	},
	deleteFile: function(fullPath){
		var _fullPath = fullPath;
	},
	moveFile: function(){

	}
};

module.exports = localFileUtil;