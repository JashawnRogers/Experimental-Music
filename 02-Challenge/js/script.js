var client_id = "1b61b5632176449fa09c6ec12f038a43"
var client_secret = "13db13d5d60044168859bd6e1d84b833"
var accessToken = ""
var modalContentEl = document.getElementById("info-modal-content")
var lyricmodalContentEl = document.getElementById("info-modal-content-lyrics")

modalContentEl.innerHTML = "SPOTIFY URL LINK FOR FAVORITE SONGS"


var artistName = "Disturbed"
var songName = "Stricken"
var songUrl = "https://api.lyrics.ovh/v1/" + artistName + "/" + songName;


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
function accessSpotify(searchTerm)
{
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        data: {
            q: searchTerm,
            type: 'album'
        },
        success: function (response2) {
            console.log(response2);
        }
    });
}
setTimeout(function(){
    accessSpotify("genre")
}, 500)

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

