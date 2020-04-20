
const searchButton = document.querySelector(".search .button");
const videoPreview = document.querySelector(".video-preview");
const relatedVideos = document.querySelector(".related-videos");
const loader = document.querySelector(".loader");
const videoList = document.querySelector(".video-list");
const pages = document.querySelector(".main-wrapper .pagination");
const message = document.querySelector(".message");

const key = "AIzaSyCsVbQbUDtXdqCDSjGLRC5R04RcG0N5hz8";

const loading = ()=> {
	loader.style.display = "block";
	videoList.style.display = "none";
	pages.style.display = "none";
	videoPreview.innerHTML = '';
	relatedVideos.innerHTML = '';
	let rel = document.querySelector("h4");
	rel ? rel.textContent = "" : console.log ("no element");
	message.style.display = "none";
}

const loaded = () => {
	loader.style.display = "none";
	videoList.style.display = "block";
	pages.style.display = "block";
}

const onSearch = () => {
	loading();

	let searchFiled = document.querySelector(".search input");

	searchFiled.value.trim() && getVideos(searchFiled.value);
	searchFiled.value = '';
}

const getVideos = searchValue => {
	let request = `https://www.googleapis.com/youtube/v3/search?part=snippet&
	type=video&maxResults=30&q=${searchValue}&key=${key}`;
	fetch(request)
  	.then( response => response.json())
  	.then( myJson => {
  		listVideos(myJson.items, "searched");
  		paginateVideos();
  	})
  	.catch( error => alert(`Error: ${error}`));
}	

const getRelatedVideos = someId => {
	let request = `https://www.googleapis.com/youtube/v3/search?part=snippet&
	maxResults=6&type=video&relatedToVideoId=${someId}&key=${key}`;
	fetch(request)
  	.then( response => response.json())
  	.then( myJson => listVideos(myJson.items, "related"))
  	.catch( error => alert(`Error: ${error}`));

}

const listVideos = (videos, type) => {
	if (type === "searched") {
		videoList.innerHTML = "";
	} else {
		relatedVideos.innerHTML = "";
		let body = document.querySelector("body");
		let heading = document.createElement("h4");
		heading.textContent = "Related videos:";
		body.appendChild(heading);
	}

	videos.forEach( video => addVideo(video, type));
}

const addVideo = (videoData, type) => {
	let videoElement = document.createElement("div");
	let img = `<img src="${videoData.snippet.thumbnails.medium.url}">`;
	let title, desc;
	if (type === "searched") {
		videoList.appendChild(videoElement);
		title = `<h3>${videoData.snippet.title}</h3>`;
		desc =`<div>${videoData.snippet.description}</div>`;
	} else {
		relatedVideos.appendChild(videoElement);
		title = `<h3>${videoData.snippet.title.substring(0,20)}...</h3>`;
		desc =`<div>${videoData.snippet.description.substring(0,60)}...</div>`;
	}

	videoElement.innerHTML = `${img}<section>${title}${desc}</section>`;	

	videoElement.querySelectorAll("h3, img").forEach(function(element) {
		element.addEventListener("click", () => {
			openVideo(videoData.id.videoId);
			getRelatedVideos(videoData.id.videoId);
		})
	})
}

const openVideo = id => {
	videoPreview.innerHTML =`<iframe width="800" height="450" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
	 document.documentElement.scrollTop = 0;
}

const paginateVideos = () => {
	let mySect = [...videoList.childNodes];
	videoList.innerHTML = "";
	let pagination = document.querySelector(".main-wrapper .pagination");
	pagination.style.display = "block";
	let mySpans = pagination.querySelectorAll("span");

	for (let i = 0 ; i <= 9; i++) {
		videoList.appendChild(mySect[i]);
	}

	mySpans[0].classList.add("selected");

	mySpans.forEach((element,index)=> {
		element.addEventListener("click", ()=> {
			videoList.innerHTML = "";
			videoPreview.innerHTML = "";

			for (let i = index*10 ; i <= index*10 + 9; i++) {
				videoList.appendChild(mySect[i]);
			}

			mySpans.forEach((span, num) => {
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

const myInput = document.querySelector(".search input");
myInput.addEventListener("keyup", e => {
	if (e.key === "Enter") {
		onSearch();
	}
})