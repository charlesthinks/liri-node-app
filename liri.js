require("dotenv").config();
var fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
let spotify = new Spotify(keys.spotify);

// The LIRI command will always be the second command line argument
var category = process.argv[2];
var query = process.argv[3];


let space = '\n';
// Function to get name of venue, venue location, date of the event
var bandsInTown = function (search) {

    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then(function (response) {
        for (var i = 0; i < 10; i++) {
            if (response.data[i]) {
                let region = response.data[i].venue.region || response.data[i].venue.country;
                let dateTime = moment(response.data[i].datetime.slice(0, 10), "YYYY-MM-DD").format("MM-DD-YYYY");
                output =
                    "\n================= LIRI FOUND THIS FOR YOU ==================\n" + space
                    + "Venue:" + response.data[i].venue.name + space
                    + `Location: ${response.data[i].venue.city}, ${region}` + space
                    + `Date: ${dateTime}`;
                console.log(output);
            }
        }
    }),
        function (error) {
            console.log(error);
        }
};

// Variable 
var spotifySong = function (songName) {
    // Append the command to the log file
    fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + songName + '\n\n', (err) => {
        if (err) throw err;
    });

    // If there is no song name, set the song to "The Sign" by Ace of Base.
    if (songName === '') {
        songName = "The Sign Ace of Base";
    }
    spotify.search({type: 'track', query: songName}, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            for (var i = 0; i < 10; i++) {
                output =
                    "\n================= LIRI FOUND THIS FOR YOU ==================\n"
                    + `Artist: ${data.tracks.items[i].album.artists[0].name}` + space
                    + `Song Name: ${data.tracks.items[i].name}` + space
                    + `Link: ${data.tracks.items[i].album.external_urls.spotify}` + space
                    + `Album Name: ${data.tracks.items[i].album.name}`;
                console.log(output);
            }
        }
    });
}

var OMDB = function (movie) {
    // Append the command to the log file
    fs.appendFile('./log.txt', 'User Command: node liri.js movie-this ' + movie + '\n\n', (err) => {
        if (err) throw err;
    });
    // If no movie is provided, LIRI defaults to 'Mr. Nobody'
    var search;
    if (movie === '') {
        search = 'Mr. Nobody';
    } else {
        search = movie;
    }
    axios.get("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy").then(
        function (response) {
            output =
                "\n================= LIRI FOUND THIS FOR YOU ==================\n"
                + `Title: ${response.data.Title}` + space
                + `Year: ${response.data.Year}` + space
                + `IMDB Rating: ${response.data.Ratings[0].Value}` + space
                + `Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}` + space
                + `Year: ${response.data.Country}` + space
                + `Plot: ${response.data.Plot}` + space
                + `Language: ${response.data.Language}` + space
                + `Actors: ${response.data.Actors}`;
            console.log(output);
        }).catch(function (err) {
            console.error(err);
        });
}

function doWhatItSays() {
    fs.readFile("./random.txt", "utf-8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(error, data);
        var dataArr = data.split(",");
        category = dataArr[0].trim();
        search = dataArr[1].trim();
        listener(category, search);
    });
};


// Declaring if statement for user search of 'concert-this'
function listener(category, query) {
    if (category === 'concert-this') {
        bandsInTown();
    };
    if (category === 'spotify-this-song') {
        spotifySong(query);
    };
    if (category === 'movie-this') {
        OMDB(query);
    };
    if (category === 'do-what-it-says') {
      
        doWhatItSays();
    }
    else if (!category) {
        commands =
            "\n================= LIRI COMMANDS ==================\n" +
            "\nTo search for a concert:" +
            "\nconcert-this <artist name>\n" +
            "\nTo search for a song:" +
            "\nspotify-this-song <song name>\n" +
            "\nTo search for a movie:" +
            "\nmovie-this <movie name>\n" +
            "\nEaster Egg:" +
            "\ndo-what-this-says";

        console.log(commands);
    }
};

listener(category, query);