var client_id = "1b61b5632176449fa09c6ec12f038a43"
var client_secret = "13db13d5d60044168859bd6e1d84b833"
var accessToken = ""
var modalContentEl = document.getElementById("info-modal-content")
var lyricmodalContentEl = document.getElementById("info-modal-content-lyrics")
var userInput = $('#search')
var searchResults = $('#search-results')
var searchForm = $('#search-form')



var artistName = "Disturbed"
var songName = "Stricken"
var songUrl = "https://api.lyrics.ovh/v1/" + artistName + "/" + songName;

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
                var imgHeight = response2.albums.items[i].images[0].height
                var imgWidth = response2.albums.items[i].images[0].width
                var searchResult = document.createElement('li');
                var searchImg = document.createElement('img')
                searchImg.src=imgEl
                searchImg.height = 50
                searchImg.width = 50
                console.log(searchImg)
                searchResult.classList.add("center-align")
                searchResult.textContent = response2.albums.items[i].artists[0].name + " - " + response2.albums.items[i].name;
                searchResults.append(searchResult);
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

fetch(songUrl)
.then(function(responseLyrics){
    return responseLyrics.json();
}) 
.then(function(data){
    console.log(data)
    lyricmodalContentEl.innerHTML = data.lyrics
})

