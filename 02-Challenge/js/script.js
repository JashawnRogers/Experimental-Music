var client_id = "1b61b5632176449fa09c6ec12f038a43"
var client_secret = "13db13d5d60044168859bd6e1d84b833"
var accessToken = ""
var modalContentEl = document.getElementById("info-modal-content")
var lyricmodalContentEl = document.getElementById("info-modal-content-lyrics")
var favButtonEl = $(".favButton")
var userInput = $('#search')
var searchResults = $('#search-results')
var searchForm = $('#search-form')
var favoritesArr = []

function displayFavorites() {
    $("#info-modal-content").empty()
    favoritesArr = JSON.parse(localStorage.getItem("favoriteSongs"))
    favoritesArr.forEach(function(item){
        var favoriteCardEl = document.createElement('li')
        favoriteCardEl.textContent = item.song
    $("#info-modal-content").append(favoriteCardEl)
    })

    
} 




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
            // console.log(response2);
            // TODO: render results in div

            // modalContentEl.innerHTML = response2.albums.items[0].artists[0].name + "-" + response2.albums.items[0].name
            
            
            for(i = 0; i < response2.albums.items.length; i++){

                
                var imgEl = response2.albums.items[i].images[0].url
                var searchResult = document.createElement('li');
                var searchImg = document.createElement('img')
                var searchResultText = document.createElement('p');
                var newfavButtonEl = document.createElement("button")
                var lyricButtonEl = document.createElement('button')

                
                if (response2.albums.items[i].album_type == "album"){
                    searchResult.classList.add("hidden")
                }


                newfavButtonEl.classList.add("material-icons")
                newfavButtonEl.classList.add('btn')
                newfavButtonEl.classList.add('btnStyle')
                newfavButtonEl.classList.add('grey')
                newfavButtonEl.classList.add('favButton')
                newfavButtonEl.classList.add('darken-4')
                lyricButtonEl.classList.add('btnStyle')
                lyricButtonEl.classList.add('btn')
                lyricButtonEl.classList.add('grey')
                lyricButtonEl.classList.add('darken-4')
                searchResultText.classList.add("center-align");
                searchResult.classList.add('collection-item');
                searchImg.classList.add('songImg');
                searchResult.setAttribute("songName", response2.albums.items[i].name)
                searchResult.setAttribute("artistName", response2.albums.items[i].artists[0].name)
                // console.log(searchResult.attributes)
                

               
                newfavButtonEl.innerHTML = "grade"
                searchImg.src= imgEl
                // console.log(searchImg)
                lyricButtonEl.innerHTML = 'Lyrics';
                searchResultText.innerHTML = response2.albums.items[i].artists[0].name + " - " + response2.albums.items[i].name;

                
                lyricButtonEl.addEventListener("click", toggleLyricModal)
                // newfavButtonEl.addEventListener("click", toggleFavoriteModal)

                // searchResult.textContent = response2.albums.items[i].artists[0].name + " - " + response2.albums.items[i].name + " - " + response2.albums.items[i].album_type;

                searchResult.append(searchResultText);
                searchResults.append(searchResult);
                searchResult.append(newfavButtonEl);
                searchResult.append(lyricButtonEl);
                searchResult.append(searchImg);

                

    
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
            }

        }
    });
}

function addToFavorites(name, artist) {
                   
    // favoritesArr = JSON.parse(localStorage.getItem("favoriteSongs"))
    var favoriteItem =  {
        song: name,
        musician: artist
    }


    favoritesArr.push(favoriteItem);
    localStorage.setItem("favoriteSongs" ,JSON.stringify(favoritesArr));
    
//   displayFavorites();
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
    displayFavorites();
}



function toggleLyricModal(){
    var instance = M.Modal.getInstance($('#lyricModal'));
    instance.open();
}


$(document).on("click", ".favButton", function(event){
    var songName = this.parentElement.getAttribute("songname");
    var artistName = this.parentElement.getAttribute("artistname");

    addToFavorites(songName, artistName);

    toggleFavoriteModal();
})
