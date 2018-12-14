//Liri.js

//required nmp packages & files
require("dotenv").config();

var keys = require("./keys");

var request = require('request');

var moment = require('moment');

var fs = require('file-system');

var Spotify = require('node-spotify-api');

let spotifyAPI = new Spotify ({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

const OMDB = keys.OMDB;

const BandsInTown = keys.BandsInTown;

//variable set up to associate position of user entered command
let command = process.argv[2];

let artistSongMovie = process.argv.slice(3).join(" ");


//Javascript switch statement to determine which command was entered & thus which function to run
switch(command) {
    case "spotify-this-song":
        searchSpotify(artistSongMovie);
        break; 
    case "movie-this":
        searchOMDB(artistSongMovie);
        break;
    case "concert-this":
        searchBIT(artistSongMovie);
        break;
    case "do-what-it-says":
        searchDWIS(artistSongMovie); 
        break;

        default:
        console.log(
          "\r\n" +
            "Type one of the following commands after 'node liri.js' : " +
            "\r\n" +
            "1. spotify-this-song 'any song name' " +
            "\r\n" +
            "2. movie-this 'any movie name' " +
            "\r\n" +
            "3. concert-this 'any artist name' " +
            "\r\n" +
            "4. do-what-it-says" + 
            "\r\n"
        );
};


// Search Spotify function
function searchSpotify(song) {
    
    if(!song) {
        song = "Bad to the Bone";
    }
    spotifyAPI.search({type: "track", query: song}, function(err, data) {
        if (err) {
            console.log("Error: " + err);
            return
        } else {
            console.log("--------- Song Details ---------\n");
            console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: " + " " + song);
            console.log("Album Name: " + data.tracks.items[0].album.name);
            console.log("URL: " + data.tracks.items[0].album.external_urls.spotify + "\n");
            console.log("------- End Song Details -------");
            // console.log(data);
            // console.log(data.tracks.items);
            // console.log(data.tracks.items[0].album.artists[0].name);
        }
    })
};

// Search OMDB function
function searchOMDB(movie) {
    
    if(!movie) {
        movie = "Pulp Fiction";
    }
    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + OMDB.id;
    // console.log(queryURL);

    request(queryURL, function(error, response, body) {
        // console.log(body);
        if (!error && response.statusCode === 200) {
          console.log("--------Movie Info-----------");
          console.log("Movie Title: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].value); 
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot); 
          console.log("Actors: " + JSON.parse(body).Actors);
          console.log("--------End Of Movie Info-----------");
        } else {
          console.log("Error :" + error);
          return;
        }
      });
};

//search BandsInTown function
function searchBIT(artist) {
    if(!artist) {
        artist = "Tenacious D";
    }
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + BandsInTown.id;
    console.log(queryURL);

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);
            console.log(body);

            for (let i = 0; i < body.length; i++) {
                let time = moment(body[i].datetime).format("MM/DD/YYYY");

                console.log("----------Concert Info----------");
                console.log("Artist: " + artist);
                console.log("Venue: " + body[i].venue.name); 
                console.log("Location: " + body[i].venue.city + ", " + body[i].venue.region + ", " + body[i].venue.country);
                console.log("Date: " + time);
                console.log("--------------------------------");
            }
        } else {
            console.log("Error: " + error);
            return;
        }

    });
};

function searchDWIS() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        if (!error) {
            var dwis = data.split(", ")
            var command1 = dwis[0]
            console.log(command1);
            var param = dwis[1]
            console.log(param);
            switch (command1) {
                case "spotify-this-song":
                    searchSpotify(param);
                    break;
                case "movie-this":                    
                    searchOMDB(param);
                    break;
                case "concert-this":                   
                    searchBIT(param);
                    break;
            }
        } else {
            console.log("Error: " + error)
        }
    });
}
