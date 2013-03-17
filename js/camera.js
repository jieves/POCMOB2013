var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var currentImage; // saves the current image

// Wait for Cordova to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// Cordova is ready to be used!
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64 encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById(currentImage);

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// A button / link will call this function
//
function capturePhoto(imageId) {
  // Take picture using device camera and retrieve image as base64-encoded string
  currentImage = imageId;
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
    destinationType: destinationType.DATA_URL, targetWidth: 800, targetHeight: 800 });
}

//Called if something bad happens.
//
function onFail(message) {
alert('Failed because: ' + message);
}



// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

/*
function onPhotoDataSuccess(imageData) 
{
     //I want to save my image here in sdcard folder.**
    var nodeid = localStorage.getItem("user_nodeid");
    var modifyImgData = imageData.replace(' ', '+');
    document.getElementById('image').src = setLocalStorageImage(localStorage.getItem(nodeid+"image"), modifyImgData);
    document.getElementById('profileMenu').src = setLocalStorageImage(localStorage.getItem(nodeid+"smallimage"), modifyImgData);
    $.ajax({
           type: "POST",
           url: appURL+"api/upload/image/" +nodeid+ "/1",
           data: "image=" + encodeURIComponent(modifyImgData),
           success: function(msg){
                    //No need to do anything here
                    if (msg.documentElement.getElementsByTagName("message")[0].childNodes[0].nodeValue != 'success')
                        onFail('Error in uploading image at server. Please try again.');
           }
        });
}
*/

function onFail(message){
    alert(message);
}