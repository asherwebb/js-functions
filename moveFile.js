//moveFile.js
//this file is bundled and a dependancy: browserify see takePic.js
var Router = require('./router.js');
var moveFile = {
  move: function(fileURI){
    //to access the image file we just took we need to resolve the uri > in resolveFs the file object is returned as callback
        		steroids.logger.log(fileURI);
    window.resolveLocalFileSystemURI(fileURI, moveFile.resolveFs, moveFile.fail);
  },
  resolveFs: function(file){
    var date = new Date();
    //store uuid, file name, path and folder parent in local storage
    //date = date.getMilliseconds();

    var uuid = Math.random().toString(36).substr(2,9);
    var fileName = "health_file" + uuid;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 50*1024*1024, gotFs, moveFile.fail);   

    function gotFs(fs){
      fs.root.getDirectory('health_files', {create:true}, function(dir){
        //alert('create health_files');
        //steroids.logger.log(dir);
        file.moveTo(dir, fileName, moveFile.fileMoved, moveFile.fail);
      }, moveFile.fail);
    }
  },
  fileMoved: function(file){
    // alert('hello');
    var _file =file;
        steroids.logger.log(file);

$( "#confirmFileModal" ).modal( { show: true } );
//attach event handlers
$("#filePreview").attr('src' , _file.fullPath ).css({'max-width':'280px','margin-bottom':'15px'});

$("#loading-box").hide();
$("#takePicBlurb").show();
//attach event to save handler to store$("")
$("#saveImage").on('click' , function(e){
	e.preventDefault();
	//var STATIC = {name:mypic,uuid:uuid,folder:insurance};
	var savedImages = [];
	if(localStorage.getItem('savedImages') !== null) {
		var cache = JSON.parse( localStorage.getItem('savedImages') );
		cache = cache.data;
		savedImages = cache;
	}

	var item = {};
	item.imageName = $('#fileName').val();
	item.folder = $('#folderDestination').val();
	item.uuid = _file.name;
	item.resolveFsPath = file.nativeURL;	
	item.fullPath = _file.fullPath;
			steroids.logger.log(item);
	savedImages.push(item);
	localStorage.setItem('savedImages' , JSON.stringify( { data:savedImages } ) ); 


	$("#confirmFileModal").modal({show: false});
	Router.newView('home.html');
});


        var win = function(file){
              steroids.logger.log('got file');

            var fileReader = new FileReader();  
            fileReader.onloadend = function () {
                  steroids.logger.log('read file');
                  var dataURLPayload = fileReader.result;
        //steroids.logger.log(dataURLPayload.length);
        dataURLPayload = {data:dataURLPayload};


            }
            fileReader.readAsDataURL(file);
        }
        //the following will trigger file reader
       // _file.file(win, moveFile.fail);

  },
  fail: function(error){

  }
};

module.exports = moveFile; 

        //       $.ajax({
        //     url: //url here ***
        //     type:'post',
        //     data:dataURLPayload,
        //     success: function(data){
        //           steroids.logger.log(data);
        //     },
        //     error: function(err){
        //         steroids.logger.log(err);
        // }
        //   });
