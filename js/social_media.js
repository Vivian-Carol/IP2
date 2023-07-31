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
let socialMedias = ['Instagram', 'Twitter', 'Facebook', 'Snapchat', 'LinkedIn']
let continents = ['Africa', 'Europe', 'Australia', 'North America', 'South America', 'Asia', 'Antarctica'];
let africanCountries = ['South Africa', 'Egypt', 'Kenya', 'Nigeria'];
let famousBrands = ['Nike', 'Louis Vouitton', 'Lacoste', 'Instagram'];
let socialMediaCategories = ['Travel', 'Fashion and Style', 'Fitness and Wellness', 'Technology'];

// JQuery Functionality when page is loaded
$(document).ready(function () {

    // Perform 1st API Call to Facts API
    $.ajax(instaSettings).done((response) => {
        
        let limit = 50;

        for (let i = 0; i < limit; i++){
            let activity = response.data[i];
            filteredResponse[i] = activity;
        }

    });

});