var client_id = "1b61b5632176449fa09c6ec12f038a43"
var client_secret = "13db13d5d60044168859bd6e1d84b833"
var accessToken = ""
var modalContentEl = document.getElementById("info-modal-content")
var lyricmodalContentEl = document.getElementById("info-modal-content-lyrics")
var favButtonEl = document.getElementById("favoriteBtn")
var favButtonModalEl = document.getElementById("favoriteBtnModal")
var favmodalContentEl = document.getElementById("info-modal-content")



var userInput = $('#search')
var searchResults = $('#search-results')
var searchForm = $('#search-form')




favButtonEl.addEventListener("click", function(){
    console.log("clicked")
})


// Get access token from spotify
$.ajax({
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (btoa (client_id + ':' + client_secret))
      },
    data: {
        q: "genre",
        type: 'album',
        grant_type: 'client_credentials'
    },
    type: "POST",
    success: function (response) {
        console.log(response);
        accessToken = response.access_token

    }
});

//function to do a spotify search
function accessSpotify(searchTerm)
{
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        data: {
            q: searchTerm,
            type: 'album',
            album_type: 'single'
        },
        success: function (response2) {
            console.log(response2);
            // TODO: render results in div

            modalContentEl.innerHTML = response2.albums.items[0].artists[0].name + "-" + response2.albums.items[0].name
            
            
            for(i = 0; i < response2.albums.items.length; i++){

                
                var imgEl = response2.albums.items[i].images[0].url

                var searchResult = document.createElement('li');
                if (response2.albums.items[i].album_type == "album"){
                    searchResult.classList.add("hidden")
                }
                searchResult.setAttribute("songName", response2.albums.items[i].name)
                searchResult.setAttribute("artistName", response2.albums.items[i].artists[0].name)
                console.log(searchResult.attributes)
                

                searchResult.classList.add("center-align")
                var searchImg = document.createElement('img')
                var favButtonEl = document.createElement("button")
                favButtonEl.classList.add("material-icons")
                favButtonEl.innerHTML = "grade"

                favButtonEl.addEventListener("click", function(){
                    var artistName = this.parentElement.getAttribute("artistName");
                    var songName = this.parentElement.getAttribute("songName");

                    localStorage.setItem("artistName", artistName)
                    localStorage.setItem("songName", songName)

                    console.log(localStorage.getItem("artistName"))
                    console.log(localStorage.getItem("songName"))

                    console.log(localStorage)
                    favmodalContentEl.innerHTML = localStorage.getItem(artistName)
                    favmodalContentEl.innerHTML = localStorage.getItem(localStorage)

                    favmodalContentEl.innerHTML = localStorage.artistName + "   - " + localStorage.songName
                })

                var lyricButtonEl = document.createElement("button")
                lyricButtonEl.addEventListener("click", function(){
                    console.log(this.parentElement.getAttribute("songName"))
                    console.log(this.parentElement.getAttribute("artistName"))

                    var artistName = this.parentElement.getAttribute("artistName");
                    var songName = this.parentElement.getAttribute("songName");
            
                    var songUrl = "https://api.lyrics.ovh/v1/" + artistName + "/" + songName;
                    console.log(songUrl)

                    fetch(songUrl)
                    .then(function(responseLyrics){
                    return responseLyrics.json();
                    }) 
                    .then(function(data){
                    console.log(data)
                    lyricmodalContentEl.innerHTML = data.lyrics
                    })
                })

                
                lyricButtonEl.addEventListener("click", toggleLyricModal)


                lyricButtonEl.innerHTML = "Lyrics"

                

                searchImg.src = imgEl

                searchImg.height = 50

                searchImg.width = 50

                searchResult.textContent = response2.albums.items[i].artists[0].name + " - " + response2.albums.items[i].name + " - " + response2.albums.items[i].album_type;

                searchResults.append(searchResult);
                searchResult.append(favButtonEl)
                searchResult.append(lyricButtonEl)
                searchResult.append(searchImg);
     
            }
            

        
            

        }
    });
}

searchForm.on("submit", function(e) {
    e.preventDefault();
    accessSpotify(userInput.val())
})

$(document).ready(function(){
    $('.modal').modal();
})

function toggleFavoriteModal(){
    var instance = M.Modal.getInstance($('#favoriteModal'));
    instance.open();
}


function toggleLyricModal(){
    var instance = M.Modal.getInstance($('#lyricModal'));
    instance.open();
}
