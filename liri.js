//Liri.js

//required nmp packages & files
require("dotenv").config();

let keys = require("./keys");

let request = require('request');

let moment = require('moment');

let fs = require('file-system');

let Spotify = require('node-spotify-api');

let spotifyAPI = new Spotify ({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

// Variable for OMDB API key
const OMDB = keys.OMDB;

// Variable for Bands in Town API key
const BandsInTown = keys.BandsInTown;

// Variable set up to associate position of user entered command
let command = process.argv[2];

// Variable set up to associate position of user entered artist, song or movie. Slices off argv 0, 1 & 2, and joins the rest of user input with a space and sets it up as argv[3]
let artistSongMovie = process.argv.slice(3).join(" ");


// Javascript switch statement to determine which command was entered & thus which function to run
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
        // Instructions for node Liri app, prints when user runs app without commands in argv[2] & argv[3] (ie. node liri.js)
        default:
        console.log(
          "\r\n" +
            "The Node Liri.js App allows you to search for a song, movie, or artist concert information using Node." +
            "\r\n" +
            "To use, simply type 'node liri.js' followed by one of the following:" +
            "\r\n" +
            "1. spotify-this-song 'any song name'" +
            "\r\n" +
            "2. movie-this 'any movie name'" +
            "\r\n" +
            "3. concert-this 'any artist name'" +
            "\r\n" +
            "4. do-what-it-says" + 
            "\r\n"
        );
};


// Search Spotify function
function searchSpotify(song) {
    // Checks to see if user entered a song (argv[3]), if no song entered, lookup song, "Bad to the Bone"
    if(!song) {
        song = "Bad to the Bone";
    }
    // Request/return info from Spotify API, runs error check-> if no error, console log results
    spotifyAPI.search({type: "track", query: song}, function(err, data) {
        if (err) {
            console.log("Error: " + err);
            return
        } else {
            console.log("--------- Song Details ---------");
            console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Name: " + " " + song);
            console.log("Album Name: " + data.tracks.items[0].album.name);
            console.log("URL: " + data.tracks.items[0].album.external_urls.spotify);
            console.log("--------------------------------");
        }
    })
};

// Search OMDB function
function searchOMDB(movie) {
    // Checks to see if user entered a movie (argv[3]), if no movie entered, lookup movie, "Pulp Fiction"
    if(!movie) {
        movie = "Pulp Fiction";
    }
    let queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + OMDB.id;

    // Use Request npm package to query the OMDB API
    request(queryURL, function(error, response, body) {
        // Checks to see if there is an error on the request/response. If no error, retrieve requested data, if error, print returned error msg.
        if (!error && response.statusCode === 200) {
          console.log("-------- Movie Info -----------");
          console.log("Movie Title: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year); 
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot); 
          console.log("Actors: " + JSON.parse(body).Actors);
          console.log("-------------------------------");
        } else {
          console.log("Error :" + error);
          return;
        }
      });
};

//search BandsInTown function
function searchBIT(artist) {
    // Checks to see if user entered a artist (argv[3]), if no artist entered, lookup artist, "Tenacious D"
    if(!artist) {
        artist = "Tenacious D";
    }
    // Variable for the query URL to access the API
    let queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + BandsInTown.id;
    console.log(queryURL);

    // Use request nmp package to get data from the Bands in Town API
    request(queryURL, function(error, response, body) {
        // Checks to for error, if no error run For-Loop, if error, jump to else statement and print returned error message
        if (!error && response.statusCode === 200) {

            // Formats returned data to JSON
            body = JSON.parse(body);

            // For-Loop runs through all show dates of returned data for requested artist
            for (let i = 0; i < body.length; i++) {
                // Use Moment npm package to format date & time the desired format
                let time = moment(body[i].datetime).format("MM/DD/YYYY");

                // Display desired data via console log
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

// Do-What-it-Says Function
function searchDWIS() {
    // Use the FS NPM package to "read" file "random.txt".  Random.txt holds data to determine the 'Command' (argv[2]) & 'Artist, Song or Movie' (argv[3])
    fs.readFile("random.txt", "utf8", function(error, data) {
        // Checks for errors, if no error run switch statement, if error, jump to else statement and display returned error in console log
        if (!error) {
            // Variable set up to split the data in random.txt at comma-space for array
            var dwis = data.split(", ")
            // Variable set up to access command (argv[2]) from random.txt
            var command1 = dwis[0]
            // Variable set up to access artist, song or movie (argv[3]) from random.txt
            var param = dwis[1]
            // Switch statement to determine which command1 (argv[2]) is requested from random.txt and passes param/dwis[1] as the argument for the requested function
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
