let Bookstorage = localStorage.getItem("BookShelf");
    if (Bookstorage == null) {
    
// display there are no books;
    }
    else{
        let books = JSON.parse(Bookstorage)
        showBookShelfContent(books)
    }


    function showBookShelfContent(data) {

        let divContainer = document.getElementById("showData");                        //access showData element from document  
        let divSearchResults = document.getElementById("searchResultsText");           //access searchResultsText element document 
        divContainer.innerHTML = "";                                                  //clear data, incase of previously stored data from another search query 
        divSearchResults.innerHTML="";
    
        if (data.length > 0)                                                    //check to see if response object contains any response aka books 
        {
            data.forEach(function(element) {                                                    //for every item (book) in response object (for loop)
    
            let temp = document.getElementsByTagName("template")[0];                                  
            let clon = temp.content.cloneNode(true);
            clon.getElementById("title").innerHTML = `Title: ${element.title}`;
            clon.getElementById("authors").innerHTML =`Author(s): ${element.author}`;
            clon.getElementById("publisher").innerHTML = `Publisher: ${element.publisher}`;
            clon.getElementById("publisheddate").innerHTML = `Published Date/Year: ${element.publishedDate}`;
            clon.getElementById("thumbnail").src= element.thumbnail;
            let Favbook={
                id:element.id
            }
            clon.getElementById("addBook").onclick = function () {
                RemoveFromBookShelf(Favbook);
            };
            divContainer.appendChild(clon);
            })
        }
      }
    
      function RemoveFromBookShelf(Favbook){
        let Bookstorage = localStorage.getItem("BookShelf");
        if (Bookstorage != null) {
        
            let books = JSON.parse(Bookstorage)
            const RemainingBooks = books.filter(object => {
                return object.id != Favbook.id;
              });
              localStorage.setItem("BookShelf", JSON.stringify(RemainingBooks));  
        }
        location.reload();

      }