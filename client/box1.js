const dateElement = document.querySelector('.date');
const titleElement = document.querySelector('.title');
const searchBarInput = document.querySelector(".search-form input");
const searchResultsContainer = document.getElementById("search-results-container");

let contentPool;
let currentIndex = 0;

// Function date and title
function updateContent() {
    let date = new Date(contentPool[currentIndex].date);
    let formattedDate = date.toLocaleDateString();

    dateElement.textContent = formattedDate;
    titleElement.textContent = contentPool[currentIndex].title;
    
    currentIndex = (currentIndex + 1) % contentPool.length; 
}


searchResultsContainer.style.display = "none";


searchBarInput.addEventListener("focus", updateSearchResults);
searchBarInput.addEventListener("input", updateSearchResults);

searchBarInput.addEventListener("blur", function() {
    
    setTimeout(function() {
        searchResultsContainer.style.display = "none";
    }, 300); 
});

function updateSearchResults() {
   
    var inputValue = this.value.trim().toLowerCase();


    searchResultsContainer.innerHTML = "";

    if (inputValue !== "") {

        fetch(`http://localhost:5000/search?query=${inputValue}`)
            .then(response => response.json())
            .then(data => {
           
                if (data.length > 0) {
                    data.forEach(function(event) {
                        var p = document.createElement("p");
                        p.textContent = event.title + " (" + event.type + ")";
                        searchResultsContainer.appendChild(p);
                    });
                  
                    searchResultsContainer.style.display = "block";
                } else {
                   
                    searchResultsContainer.textContent = "No matches found";
                 
                    searchResultsContainer.style.display = "block";
                }
            })
            .catch(error => console.error(error));
    }
}

fetch('http://localhost:5000/events')
    .then(response => response.json())
    .then(data => {
        contentPool = data;
        updateContent();
        
      
        setInterval(updateContent, 2500); // Change content 
    })
    .catch(console.error);
