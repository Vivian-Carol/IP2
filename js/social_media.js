//  API Config
const baseUrl = "https://instagram-statistics-api.p.rapidapi.com/statistics/activity?cid=";

const apiKey = apiConfig.instagramStatisticsApiKey;
const apiHost = apiConfig.instagramStatisticsHost;
const CID = apiConfig.instagramCID;

const instaSettings = {
    "async": true,
    "crossDomain": true,
    "url": `${baseUrl}${CID}`,
    "method": "GET",
    "data": {
        "limit": 50
    },
    "headers": {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost
    }
};

let filteredResponse = [];
let continents = ['Africa', 'Europe', 'Australia', 'North America', 'South America', 'Asia', 'Antarctica'];

// JQuery Functionality when page is loaded
$(document).ready(function () {

    // Perform 1st API Call to Facts API
    $.ajax(instaSettings).done((response) => {

        console.log(response);
        
        let limit = 50;

        for (let i = 0; i < limit; i++){
            let activity = response.data[i];
            filteredResponse[i] = activity;
        }

        console.log(filteredResponse);

    });

});