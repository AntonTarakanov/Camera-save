var video = document.querySelector('#camera-stream'),
    image = document.querySelector('#snap'),
    camera = document.querySelector('#start-camera'),
    controls = document.querySelector('.controls'),
    take_photo = document.querySelector('#take-photo'),
    delete_photo = document.querySelector('#delete-photo'),
    download_photo = document.querySelector('#download-photo'),
    error = document.querySelector('#error-message');

// _________ compatibility
function getNavigator () {
    return ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
}
navigator.getMedia = getNavigator ();

if(!navigator.getMedia){
    displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
}
else{
    navigator.getMedia(
        {
            video: true
        },
        //create URL-address for set src element HTML
        function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
            video.onplay = function() {
                showVideo();
            };
        },
        function(err){
            displayErrorMessage("Error" + err.name, err);
        }
    );
}

function startVideo (event) {
    event.preventDefault();
    video.play();
    showVideo();
}

function takePhoto (event) {
    event.preventDefault();
    var snap = takeSnapshot();
    image.setAttribute('src', snap);
    image.classList.add("visible");
    delete_photo.classList.remove("disabled");
    download_photo.classList.remove("disabled");
    download_photo.href = snap;
    video.pause();
}

function deletePhoto(event) {
    event.preventDefault();
    image.setAttribute('src', "");
    image.classList.remove("visible");
    delete_photo.classList.add("disabled");
    download_photo.classList.add("disabled");
    video.play();
}

function showVideo(){
    hideUI();
    video.classList.add("visible");
    controls.classList.add("visible");
}

camera.addEventListener("click", startVideo);
take_photo.addEventListener("click", takePhoto);
delete_photo.addEventListener("click", deletePhoto);

//---------------------------------start canvas
function takeSnapshot(){
    var hidden_canvas = document.querySelector('canvas'),
        context = hidden_canvas.getContext('2d');
    var width = video.videoWidth,
        height = video.videoHeight;
    if (width && height) {
        hidden_canvas.width = width; // change
        hidden_canvas.height = height; // change
        context.drawImage(video, 0, 0, width, height);
        return hidden_canvas.toDataURL('image/png');
    }
}

function displayErrorMessage(error_msg, error){
    error = error || "";
    if(error){
        console.log(error);
    }
    error.innerText = error_msg;
    hideUI();
    error.classList.add("visible");
}

function hideUI(){
    controls.classList.remove("visible");
    camera.classList.remove("visible");
    video.classList.remove("visible");
    snap.classList.remove("visible");
    error.classList.remove("visible");
}