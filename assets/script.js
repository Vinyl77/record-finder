var fetchButton = document.querySelector('fetch-button');
var recordList = document.querySelector('ul')

function fetchErrorCheck(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        console.log(response);
        throw Error(response.statusText);
    }
}

function handleRecords(records) {
    records.forEach(record => {
        console.log("record");
        console.log(record);
        record.releases.forEach(entry => {
            console.log("artist");
            console.log(entry.artist);
            console.log("title");
            console.log(entry.title);
        });
    });
}







function getApi(startPage = 1, pulledData = undefined) {
    // Insert the API url to get a list of your repos
    var requestUrl = `https://api.discogs.com/artists/1/releases?per_page=100&page=${startPage}`; // note start page usage here
    console.log("gotten so far");
    console.log(pulledData); // will be empty for first iteration through, filled with data afterwards
    $.ajax({
        url: requestUrl,
        type: "GET",
        success: function (record) {
            console.log(record); // can be removed, shows structure of items
            if (pulledData) {
                pulledData.push(record); // store records in if they already exist
            } else {
                pulledData = [record]; // otherwise make a array that contains current results
            }
            if (record.pagination.pages > startPage) {
                pulledData = getApi(startPage + 1, pulledData); // refer back to ourselves for more data until we reach end. Store returned data properly back to the pulledData.
            } else {
                console.log("Full stack of records...");
                console.log(pulledData); // when all pages are read, this will have all data stored
                // one should call another function to move on from here, such as below
                handleRecords(pulledData);
            }
        },
        error: function (xhr, ajaxOptions, throwError) {
            // all error response conditions, like 404 / page not found below
            if (xhr.status == 404) {
                console.error("404 - EndPoint not available!");
                console.error(xhr);
            }
        }
    });
    return pulledData;
}

function runAPI() {
    getApi();
}

fetchButton.addEventListener('click', runAPI);
