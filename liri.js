
require("dotenv").config();


var request = require("request");


var moment = require('moment');


var fs = require("fs");


var keys = require("./keys.js");

// Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Omdb and Bandsintown
var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);


// Code for user input
var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");


// liribot code
function userCommand(userInput, userQuery) {
    // switch statement for what to do depending on command
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I don't understand");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);
    // Uses request for API Search
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
    
        if (!error && response.statusCode === 200) {
           
            var userBand = JSON.parse(body);
            
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

            
                    console.log("\n------- " +
                     "\nArtist: " + 
                     userBand[i].lineup[0] +
                      "\nVenue: " + userBand[i].venue.name + 
                      "\nVenue Location: " +
                      userBand[i].venue.latitude,userBand[i].venue.longitude +
                      "\nVenue City: "
                      + userBand[i].venue.city, userBand[i].venue.country)
 
                    var concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log("Date and Time: "  + concertDate + " \n\n- - - - -");
                };
            } else {
                console.log('Band or concert not found!');
            };
        };
    });
};

function spotifyThisSong() {
    console.log("\n - - - - -\n\nSEARCHING FOR..." + userQuery);

    // if user query isnt found pass Runaway
    if (!userQuery) {
        userQuery = "Runaway"
    };

    // search query code
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        // data placed in array
        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log("\n------ " + 
            "\n\nArtist: " + data.tracks.items[i].album.artists[0].name + 
            "\nSong: " +
            data.tracks.items[i].name+
            "\nAlbum: " + 
            data.tracks.items[i].album.name +
            "\nSpotify link: "+
            data.tracks.items[i].external_urls.spotify +
            "\n\n - - - - -")
        };
    });
}

function movieThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);
    if (!userQuery) {
        userQuery = "the Master";
    };
    // REQUEST USING OMDB API
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=7222c255", function (error, response, body) {
        let userMovie = JSON.parse(body);

        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(
                "\n-----" +
                "n\nTitle: " +
                userMovie.Title + 
                "\nCast: " + 
                userMovie.Actors +
                "\nReleased: " + 
                userMovie.Year + 
                "\nIMDb Rating: " +
                userMovie.imdbRating +
                "\nRotten Tomatoes Rating: " +
                userMovie.Ratings[1].Value+
                "\nCountry: " +
                userMovie.Country +
                "\nLanguage: " +
                userMovie.Language+ 
                "\nPlot: " +
                userMovie.Plot +
                "\n\n- - - - -")
        } else {
            return console.log("Movie unable to be found. Error:" + error)
        };
    })
};

function doThis() {
    // access random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        
        let dataArr = data.split(",");

        // pass random.txt objects as parameters
        userInput = dataArr[0];
        userQuery = dataArr[1];
        // call function with new parameters
        userCommand(userInput, userQuery);
    });
};