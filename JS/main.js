
var searchButton = document.querySelector(".search .button");
var videoPreview = document.querySelector(".video-preview");
var relatedVideos = document.querySelector(".related-videos");
var loader = document.querySelector(".loader");
var videoList = document.querySelector(".video-list");
var pages = document.querySelector(".main-wrapper .pagination");
var message = document.querySelector(".message");

var key = "AIzaSyCQl6uGkd-u0hST_9M1gc__TZtjQ4Gq9Lc";

function loading() {
	loader.style.display = "block";
	videoList.style.display = "none";
	pages.style.display = "none";
	videoPreview.innerHTML = '';
	relatedVideos.innerHTML = '';
	var rel = document.querySelector("h4");
	rel ? rel.textContent = "" : console.log ("no element");
	message.style.display = "none";
}

function loaded() {
	loader.style.display = "none";
	videoList.style.display = "block";
	pages.style.display = "block";
}

function onSearch() {
	loading();

	var searchFiled = document.querySelector(".search input");

	searchFiled.value.trim() && getVideos(searchFiled.value);
	searchFiled.value = '';
}

function getVideos(searchValue) {
	var request = new XMLHttpRequest();

	request.open("GET", 'https://www.googleapis.com/youtube/v3/search?part=snippet&\
	type=video&maxResults=30&q=' + searchValue +'&key=' + key);

	request.onload = function(){
		listVideos(JSON.parse(request.responseText).items, "searched"); 
		paginateVideos();
	}

	request.send();
}	

function getRelatedVideos(someId) {
	var request = new XMLHttpRequest();

	request.open("GET", 'https://www.googleapis.com/youtube/v3/search?part=snippet&\
	maxResults=6&type=video&relatedToVideoId=' + someId +'&key=' + key);

	request.onload = function(){
		listVideos(JSON.parse(request.responseText).items, "related");
	}

	request.send();
}

function listVideos(videos, type) {
	if (type === "searched") {
		videoList.innerHTML = "";
	} else {
		relatedVideos.innerHTML = "";
		var body = document.querySelector("body");
		var heading = document.createElement("h4");
		heading.textContent = "Related videos:";
		body.appendChild(heading);
	}

	videos.forEach(function(video) {
		addVideo(video, type);
	})	
}

function addVideo(videoData, type) {
	var videoElement = document.createElement("div");
	var img = '<img src="' + videoData.snippet.thumbnails.medium.url +'">';
	
	if (type === "searched") {
		videoList.appendChild(videoElement);
		var title = '<h3>' + videoData.snippet.title + '</h3>';
		var desc ='<div>' + videoData.snippet.description + '</div>';
	} else {
		relatedVideos.appendChild(videoElement);
		var title = '<h3>' + videoData.snippet.title.substring(0,20) + "..." + '</h3>';
		var desc ='<div>' + videoData.snippet.description.substring(0,60) + "..." + '</div>';
	}

	videoElement.innerHTML = img + '<section>' + title + desc + '</section>';	

	videoElement.querySelectorAll("h3, img").forEach(function(element) {
		element.addEventListener("click", function() {
			openVideo(videoData.id.videoId);
			getRelatedVideos(videoData.id.videoId);
		})
	})
}

function openVideo(id) {
	videoPreview.innerHTML = '<iframe width="800" height="450"\
	 src="https://www.youtube.com/embed/' + id + '" frameborder="0"\
	  allow="accelerometer; autoplay; encrypted-media; gyroscope; \
	  picture-in-picture" allowfullscreen></iframe>';
	  document.documentElement.scrollTop = 0;
}

function paginateVideos() {
	var mySect = [...videoList.childNodes];
	videoList.innerHTML = "";
	var pagination = document.querySelector(".main-wrapper .pagination");
	pagination.style.display = "block";
	var mySpans = pagination.querySelectorAll("span");

	for (var i = 0 ; i <= 9; i++) {
		videoList.appendChild(mySect[i]);
	}

	mySpans[0].classList.add("selected");

	mySpans.forEach((element,index)=> {
		element.addEventListener("click", ()=> {
			videoList.innerHTML = "";
			videoPreview.innerHTML = "";

			for (var i = index*10 ; i <= index*10 + 9; i++) {
				videoList.appendChild(mySect[i]);
			}

			mySpans.forEach((span, num)=> {
				if (num === index) {
					span.classList.add("selected");
				} else {
					span.classList.remove("selected");
				}
			})	
			document.documentElement.scrollTop = 0;	
		})
	})
	loaded();
}

// init

searchButton.addEventListener("click", onSearch);

var myInput = document.querySelector(".search input");
myInput.addEventListener("keyup", e => {
	if (e.key === "Enter") {
		onSearch();
	}
})