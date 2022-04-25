//variables for retrieving api data 
var qsearch;
var apiKey = '&key=' + config.api_key;
var apiURL = "https://www.googleapis.com/books/v1/volumes?q=";
var type = '&Type=books'
var maxResults = "&maxResults=" + 40;
var resultsPerPage = 40;
var _totalResults = 0;


function SearchBooks(currPage) {
    qsearch = document.getElementById("searchItem").value;           //gets searchItem value (search query) out of search box input 
    if (qsearch == "") {                                             //user input validation: if search was empty (submit button was pressed without query)     
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML = "No search text found, please try again";    //warning message 
    }
    else {
        var Index = 40 + (40 * (currPage - 2));
        var startIndex = "&startIndex=" + Index;
        let xmlhttp = new XMLHttpRequest();                                 //create new request using xmlhttp library 
        var url = `${apiURL}${qsearch}${type}${maxResults}${startIndex}${apiKey}`;        //append url, qsearch, and key for full request url 

        xmlhttp.open("GET", url, true);                                     //make GET http request with url  
        xmlhttp.send();                                                     //send request to api

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {               //anonymous function: when request is made + response is returned and if http return status is successful
                var data = JSON.parse(this.responseText);                  //then take returned JSON data, parse and store in object 
                showContent(currPage, data, Index);                                         //pass object containing parsed JSON response to showContent function 
            }
        };
    }
}


function showContent(currPage, data, Index) {

    let divContainer = document.getElementById("showData");                        //access showData element from document  
    let divSearchResults = document.getElementById("searchResultsText");           //access searchResultsText element document 
    divContainer.innerHTML = "";                                                  //clear data, incase of previously stored data from another search query 
    divSearchResults.innerHTML = "";

    if (data.items.length > 0)                                                    //check to see if response object contains any response aka books 
    {
        divSearchResults.innerHTML = `Showing ${Index + 1} - ${Index + 40} of ${data.totalItems} results for <b>${qsearch}</b>`; //display number of results returned, total items is sent back to current document 
        data.items.forEach(function (element) {                                                    //for every item (book) in response object (for loop)

            let temp = document.getElementsByTagName("template")[0];
            let clon = temp.content.cloneNode(true);
            clon.getElementById("title").innerHTML = `${element.volumeInfo.title}`;
            if (element.volumeInfo.authors != undefined)
                clon.getElementById("authors").innerHTML = `${element.volumeInfo.authors.join()}`;
            clon.getElementById("publisher").innerHTML = `Publisher: ${element.volumeInfo.publisher}`;
            clon.getElementById("publisheddate").innerHTML = `Published Date/Year: ${element.volumeInfo.publishedDate}`;
            if (element.volumeInfo.imageLinks != undefined)
                clon.getElementById("thumbnail").src = element.volumeInfo.imageLinks.thumbnail;

                let book={
                    id:element.id,
                    Title:element.volumeInfo.title,
                    Author:(element.volumeInfo.authors != undefined) ? element.volumeInfo.authors.join(): "" ,
                    Publisher:element.volumeInfo.publisher,
                    PublishedDate:element.volumeInfo.publishedDate,
                    thumbnail: (element.volumeInfo.imageLinks != undefined) ? element.volumeInfo.imageLinks.thumbnail : ""
                }
            
            clon.getElementById("addBook").onclick = function() {
                //addToBookshelf(book)
                AddToBookShelfStorage(book);
            }

            divContainer.appendChild(clon);
        })
        pagination(currPage, data.totalItems);
    }
}

function handle(e) {    //Used to handle searches using 'ENTER' key
    address = document.getElementById("searchItem").value;
    if (e.keyCode === 13) {
        SearchBooks(1);
    }
    return false;
}


function pagination(currpage, searchResultsCount) {
    if (currpage == 0)
        currpage = 1;
    divpaginationBar = document.getElementById("pagination");
    let pageButtons = 10;
    let PaginationRange = pageButtons - 1;
    const totalPages = Math.ceil(searchResultsCount / resultsPerPage);

    let paginationStart = Math.ceil(currpage / pageButtons) * pageButtons - PaginationRange;

    if (paginationStart + pageButtons - 1 < totalPages)
        paginationEnd = paginationStart + PaginationRange;
    else
        paginationEnd = totalPages;

    const buttons = [];

    if (paginationStart > pageButtons)
        buttons.push('prev');

    for (let i = paginationStart; i <= paginationEnd; i++) {
        buttons.push(i);
    }

    if (paginationEnd < totalPages)
        buttons.push('next');

    console.log(buttons)

    divpaginationBar.innerHTML = "";
    buttons.forEach(function (element) {
        var pgbutton = document.createElement('button');
        pgbutton.innerText = element;

        if (element == 'next') {
            pgbutton.className = 'pg-btn next-page'
            pgbutton.onclick = function () {
                SearchBooks(paginationEnd + 1);
            };

        } else if (element == 'prev') {
            pgbutton.className = 'pg-btn prev-page'
            pgbutton.onclick = function () {
                SearchBooks(paginationStart - 1);
            };

        }

        else {
            pgbutton.className = 'pg-btn'
            pgbutton.onclick = function () {
                SearchBooks(element);
            };
        }

        if (currpage == element)
            pgbutton.classList.add('active');

        divpaginationBar.appendChild(pgbutton);
        window.scrollTo(0, 0);
    })

}

function addToBookshelf(book){
    if (book.id == "") {                                             //user input validation: if search was empty (submit button was pressed without query)     
         // todo: show message to user
    }
    else {
        
       
        let xmlhttp = new XMLHttpRequest();                                 //create new request using xmlhttp library 
        var url = 'addbook';        //append url, qsearch, and key for full request url 

        xmlhttp.open("Post", url, true);  
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(JSON.stringify(book));                                          //send request to api

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {               //anonymous function: when request is made + response is returned and if http return status is successful
                var data = JSON.parse(this.responseText);                  //then take returned JSON data, parse and store in object 
               console.log(data);                                       //pass object containing parsed JSON response to showContent function 
            }
        };
    }

}

function AddToBookShelfStorage (Favbook){

    let Bookstorage = localStorage.getItem("BookShelf");
    if (Bookstorage == null) {
    
        let books=[]
        books.push(Favbook)
        localStorage.setItem("BookShelf", JSON.stringify(books));
    }else{
        let books = JSON.parse(Bookstorage)

        const index = books.findIndex(object => object.id === Favbook.id);
        if (index === -1) {
            books.push(Favbook);
            localStorage.setItem("BookShelf", JSON.stringify(books));
        }

    }
    
  }


