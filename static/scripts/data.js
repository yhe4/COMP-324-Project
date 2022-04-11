//retrieve api data 
var qsearch; 
var apiKey = '&key=' + config.api_key; 
var apiURL = "https://www.googleapis.com/books/v1/volumes?q="; 
var _maxResults = 10; 
var _startIndex = 0; 
var _totalResults = 0;


function SearchBooks() {

    qsearch= document.getElementById("searchItem").value;           //gets searchItem value (search query) out of search box input 
    if (qsearch == ""){                                             //user input validation: if search was empty (submit button was pressed without query)     
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML="No search text found, please try again";    //warning message 
    }
    else{
        let xmlhttp = new XMLHttpRequest();                                 //create new request using xmlhttp library 
        var url = `${apiURL}${qsearch}${apiKey}`;                           //append url, qsearch, and key for full request url 
    
        xmlhttp.open("GET", url, true);                                     //make GET http request with url  
        xmlhttp.send();                                                     //send request to api

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {               //anonymous function: when request is made + response is returned and if http return status is successful
                var data = JSON.parse(this.responseText);                  //then take returned JSON data, parse and store in object 
                showContent(data);                                         //pass object containing parsed JSON response to showContent function 
            }
        };
    
    }
}


function showContent(data) {

    let divContainer = document.getElementById("showData");                        //access showData element from document  
    let divSearchResults = document.getElementById("searchResultsText");           //access searchResultsText element document 
    divContainer.innerHTML = "";                                                  //clear data, incase of previously stored data from another search query 
    divSearchResults.innerHTML="";

    if (data.items.length > 0)                                                    //check to see if response object contains any response aka books 
    {
        divSearchResults.innerHTML=`A total of <b>${data.totalItems}</b> results have been found with the keyword <b>${qsearch}</b>"`; //display number of results returned, total items is sent back to current document 
        data.items.forEach(function(element) {                                                    //for every item (book) in response object (for loop)

        let temp = document.getElementsByTagName("template")[0];                                  
        let clon = temp.content.cloneNode(true);
        clon.getElementById("title").innerHTML = `Title: ${element.volumeInfo.title}`;
        clon.getElementById("authors").innerHTML =`Author(s): ${element.volumeInfo.authors[0]}`;
        clon.getElementById("publisher").innerHTML = `Publisher: ${element.volumeInfo.publisher}`;
        clon.getElementById("publisheddate").innerHTML = `Published Date\Year: ${element.volumeInfo.publishedDate}`;
        clon.getElementById("thumbnail").src= element.volumeInfo.imageLinks.thumbnail;

        divContainer.appendChild(clon);
        })
    }
  }

