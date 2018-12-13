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



//Javascript switch statement to determine which command was entered & thus which function to run
switch(command) {
    case "spotify-this-song":
        searchSpotify();
        break; 
    case "movie-this":
        searchOMDB();
        break;
    case "concert-this":
        searchBIT();
        break;
    case "do-what-it-says":
        searchDWIS(); 
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
function searchSpotify() {
    let songTitle = process.argv.slice(3).join(" ");
    if(!songTitle) {
        songTitle = "Bad to the Bone";
    }
    spotifyAPI.search({type: "track", query: songTitle}, function(err, data) {
        if (err) {
            console.log("Error: " + err);
            return
        } else {
            console.log(songTitle);
            console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: " + " " + songTitle);
            console.log("Album Name: " + data.tracks.items[0].album.name);
            console.log("URL: " + data.tracks.items[0].album.external_urls.spotify + "\n");
            // console.log(data);
            console.log(data.tracks.items);
            // console.log(data.tracks.items[0].album.artists[0].name);
        }
    })
};

// Search OMDB function
function searchOMDB() {
    let movieTitle = process.argv.slice(3).join(" ");
    if(!movieTitle) {
        movieTitle = "Pulp Fiction";
    }
    let queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=" + OMDB.id;
    console.log(queryURL);

    request(queryURL, function(error, response, body) {
        console.log(body);
        if (!error && response.statusCode === 200) {
          console.log("--------Movie Info-----------" + "\n");
          console.log("Movie Title: " + JSON.parse(body).Title + "\n");
          console.log("Release Year: " + JSON.parse(body).Year + "\n");
          console.log("Rotten Tomato Rating: " + JSON.parse(body).Ratings[1].value + "\n"); 
          console.log("Country: " + JSON.parse(body).Country + "\n");
          console.log("Language: " + JSON.parse(body).Language + "\n");
          console.log("Plot: " + JSON.parse(body).Plot + "\n"); 
          console.log("Actors: " + JSON.parse(body).Actors + "\n");
          console.log("--------End Of Movie Info-----------" + "\n");
        } else {
          console.log("Error :" + error);
          return;
        }
      });
}

//search BandsInTown function
function searchBIT() {
    let bandName = process.argv.slice(3).join(" ");
    if(!bandName) {
        bandName = "Phish";
    }
    let queryURL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=" + BandsInTown.id;
    console.log(queryURL);

    request(queryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);
            console.log(body);

            for (let i = 0; i < body.length; i++) {
                let time = moment(body[i].datetime).format("MM/DD/YYYY");

                console.log("----------Concert Info----------");
                console.log("Artist: " + bandName);
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

}










