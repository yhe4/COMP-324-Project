//vars fro retrieving api data 
var qsearch; 
var apiKey = '&key=' + config.api_key; 
var apiURL = "https://www.googleapis.com/books/v1/volumes?q="; 
var type = '&Type=books'
var maxResults = "&maxResults=" + 20; 
var resultsPerPage = 20; 
var _totalResults = 0;


function SearchBooks(currPage) {
    qsearch= document.getElementById("searchItem").value;           //gets searchItem value (search query) out of search box input 
    if (qsearch == ""){                                             //user input validation: if search was empty (submit button was pressed without query)     
        let divContainer = document.getElementById("showData");
        divContainer.innerHTML="No search text found, please try again";    //warning message 
    }
    else{
        var Index = 20 + (20 * (currPage - 2));
        var startIndex = "&startIndex=" + Index; 
        let xmlhttp = new XMLHttpRequest();                                 //create new request using xmlhttp library 
        var url = `${apiURL}${qsearch}${type}${maxResults}${startIndex}${apiKey}`;        //append url, qsearch, and key for full request url 
    
        xmlhttp.open("GET", url, true);                                     //make GET http request with url  
        xmlhttp.send();                                                     //send request to api

        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {               //anonymous function: when request is made + response is returned and if http return status is successful
                var data = JSON.parse(this.responseText);                  //then take returned JSON data, parse and store in object 
                showContent(currPage, data);                                         //pass object containing parsed JSON response to showContent function 
            }
        };
    }
}

// function paginationBooks() {
//     qsearch= document.getElementById("searchItem").value;           //gets searchItem value (search query) out of search box input 
//     if (qsearch == ""){                                             //user input validation: if search was empty (submit button was pressed without query)     
//         let divContainer = document.getElementById("showData");
//         divContainer.innerHTML="No search text found, please try again";    //warning message 
//     }
//     else{
//         let btn_num = document.getElementById("btn-3").textContent;
//         var Index = 40 + (40 * (btn_num - 2));
//         console.log(Index)
//         var startIndex = "&startIndex=" + Index; 
//         let xmlhttp = new XMLHttpRequest();                                 //create new request using xmlhttp library 
//         var url = `${apiURL}${qsearch}${type}${maxResults}${startIndex}${apiKey}`;        //append url, qsearch, and key for full request url 
    
//         xmlhttp.open("GET", url, true);                                     //make GET http request with url  
//         xmlhttp.send();                                                     //send request to api

//         xmlhttp.onreadystatechange = function() {
//             if (this.readyState == 4 && this.status == 200) {               //anonymous function: when request is made + response is returned and if http return status is successful
//                 var data = JSON.parse(this.responseText);                  //then take returned JSON data, parse and store in object 
//                 showContent(data);                                         //pass object containing parsed JSON response to showContent function 
//             }
//         };

    
//     }

// }


function showContent(currPage,data) {

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
        if (element.volumeInfo.authors != undefined)
        clon.getElementById("authors").innerHTML =`Author(s): ${element.volumeInfo.authors.join()}`;
        clon.getElementById("publisher").innerHTML = `Publisher: ${element.volumeInfo.publisher}`;
        clon.getElementById("publisheddate").innerHTML = `Published Date/Year: ${element.volumeInfo.publishedDate}`;
        if (element.volumeInfo.imageLinks != undefined)
            clon.getElementById("thumbnail").src= element.volumeInfo.imageLinks.thumbnail;

        divContainer.appendChild(clon);
        })
        pagination(currPage,data.totalItems);
    }
  }

// total = total pages we have (must be determined depending on api repsonse)
// max = maximum visible pages (how many pages we show at a time)
// current = current page being viewed or active
// ^ current page should be at the center unless page # is beginning or at end

// function pagination(currentPage, totalBooks) {
//    let totalPages = Math.ceil(totalBooks/20);           //calculate number of pages needed; divide total books by 40 books per page, rounding up if decimal.  

//     const pageNumbers = (total, max = 10, current) => {            //calculate numbers representing the visible pages
//         const half = Math.round (max/2);
//         let to = max;
//         if(current + half >= total){                                  //check if current page is in range of begining or end of pagination
//             to = total; 
//         } 
//         else if (current > half) {
//             to = current + half;
//         }
//         let from = to - max; 
//         return Array.from({length: max}, (_,i) => (i + 1) + from);
//     }
//        currPageNumbers = pageNumbers(totalPages, currentPage)
//        const disabled = {
//         start: () => currPageNumbers[0] === 1,
//         prev: () => currentPage === 1 || currentPage > totalPages,
//         end: () => pages.slice(-1)[0] === totalPages,
//         next: () => currentPage >= totalPages
//       }
       
//        const paginationDivContainer = document.createElement('div');
//        paginationDivContainer.className = 'pagination-buttons';

       
//        //function to create button 
//        const createButton = (textLabel = '', cls = '', disabled = false, handleClick) => {
//             const button = document.createElement('button');
//             button.textContent = textLabel;
//             button.className = 'pg-btn ${cls}';
//             buttonElement.disabled = disabled;
//             buttonElement.addEventListener('click', e => {
//                 handleClick(e);
//                 this.update();
//                 paginationButtonContainer.value = currentPage;
//                 paginationButtonContainer.dispatchEvent(new CustomEvent('change', {detail: {currentPageBtn}}));
//              });
//              return buttonElement;
//             }
            

//             currPageNumbers.forEach(function(page) {
//                 pgbutton = createButton();
        
//                 if (currentPage==page)
//                     pgbutton.classList.add('active');
        
//                 if (page=='next') {
//                     a.onclick = function () {
//                         SearchBooks(paginationEnd+1);
//                     };
        
//                 }else if (page=='prev'){
        
//                     a.onclick = function () {
//                         SearchBooks(paginationStart-1);
//                     };
        
//                 }else{
//                     a.onclick = function () {
//                         SearchBooks(page);
//                     };
                   
//                 }
//                 paginationDivContainer.appendChild(pgbutton);
//             })
            
//           }

function pagination(currpage, searchResultsCount){
    if (currpage==0)
        currpage=1;
    divpaginationBar= document.getElementById("pagination");
    let pageButtons =10;
    let PaginationRange=pageButtons-1;
    const totalPages = Math.ceil(searchResultsCount/resultsPerPage);

    let paginationStart= Math.ceil(currpage  /pageButtons) * pageButtons - PaginationRange;

    if ( paginationStart + pageButtons-1  < totalPages )
            paginationEnd= paginationStart + PaginationRange;
    else 
            paginationEnd= totalPages ;

    const buttons=[];

    if (paginationStart > pageButtons)
    buttons.push('prev');

    for (let i=paginationStart; i <=  paginationEnd ;i++) {
        buttons.push(i);
    }

    if (paginationEnd < totalPages)
    buttons.push('next');

    console.log(buttons)

    divpaginationBar.innerHTML = "";
    buttons.forEach(function(element) {
        var pgbutton = document.createElement('button');
        pgbutton.innerText = element;

        if (element=='next') {
            pgbutton.className = 'pg-btn next-page'
            pgbutton.onclick = function () {
                SearchBooks(paginationEnd+1);
            };

        }else if (element=='prev'){
            pgbutton.className = 'pg-btn prev-page'
            pgbutton.onclick = function () {
                SearchBooks(paginationStart-1);
            };

        }
        
        else {
            pgbutton.className = 'pg-btn'
            pgbutton.onclick = function () {
                SearchBooks(element);
            };  
        }

        if (currpage==element)
        pgbutton.classList.add('active');
        
        divpaginationBar.appendChild(pgbutton);
    })
    
  }
