document.getElementById("searchBar").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission
        const query = this.value; // Get the value from the input
        if (query) { // Check if query is not empty
            searchNews(query); // Call the function to search news
        } else {
            alert("Please enter a search term."); // Alert if no query
        }
    }
});

function searchNews(query) {
    // Send a request to the server with the search query
    fetch(`/search_news/?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {

            const featuredArticlesSection = document.getElementById("featured-articles");
      
            featuredArticlesSection.innerHTML = '<h2>Featured Articles</h2>'; 

            if (data.articles && data.articles.length > 0) {

                data.articles.forEach(article => {
                    

                    const articleElement = document.createElement('article');

                    const imgElement = document.createElement('img');
                    imgElement.className = 'imgArticle';
                    imgElement.src = article.urlToImage || 'djdj'; // Use a default image if none exists
                    imgElement.alt = 'Article Image';

                    const divBlock = document.createElement('div');

                    const titleElement = document.createElement('h3');
                    titleElement.textContent = article.title;

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = article.description;

                    const addSummaryButton = document.createElement("Button");
                    addSummaryButton.innerText = 'ADD TO SUMMARY';
                    addSummaryButton.onclick = function (){
                        addSummary(article.title,article.url);
                    }
                 
                    articleElement.appendChild(imgElement);
                    divBlock.appendChild(titleElement);
                    divBlock.appendChild(descriptionElement);
                    articleElement.appendChild(divBlock)
                    articleElement.appendChild(addSummaryButton);

                    featuredArticlesSection.appendChild(articleElement);
                })
            }
        })
        .catch(error => alert('some error occured , try again'));
}


function addSummary(title,url) {

    const aTag = document.createElement('a');
    aTag.href = url;

    const divSummaryBlock = document.createElement('div');
    divSummaryBlock.className = 'remove_block';

    const summaryParagraph = document.createElement('p');
    summaryParagraph.textContent = title;

    aTag.appendChild(summaryParagraph);

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove News';
    removeButton.onclick = function() { 
        removeSummary(url); 
        divSummaryBlock.remove(); 
        console.log(urls); 
    }


    divSummaryBlock.appendChild(aTag);
    divSummaryBlock.appendChild(removeButton);

    const outerSummaryHolder = document.getElementById('summuryHolder').querySelector('.newsBlock');
    const block = document.createElement('div');
    block.appendChild(divSummaryBlock);

    outerSummaryHolder.appendChild(block);
}

//=======================
async function getSummary(urls) {
    // Create a background blur overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.zIndex = '9998';
    document.body.appendChild(overlay);

    // Dynamically create the popup div
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '9999';
    document.body.appendChild(popup);
  
    // Show loading message initially
    const loadingMessage = document.createElement('p');
    loadingMessage.innerHTML = 'Loading...';
    popup.appendChild(loadingMessage);
  
    // Create a close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#4CAF50';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    popup.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(popup);
    });

    try {
        
        const response = await fetch('/get_summary/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urls: urls }),
        });
  

        if (response.ok) {
            const data = await response.json();
            loadingMessage.style.display = 'none';  // Hide loading message
            const summaryMessage = document.createElement('p');
            summaryMessage.innerHTML = data.summary || 'Summary not available';
            popup.appendChild(summaryMessage);

        } else {
            // Handle the error if response is not ok
            loadingMessage.style.display = 'none';
            const errorMessage = document.createElement('p');
            errorMessage.innerHTML = 'Error occurred. Please try again.';
            errorMessage.style.color = 'red';
            popup.appendChild(errorMessage);
        }
    } catch (error) {
        // If there was an error with the fetch
        loadingMessage.style.display = 'none';
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = 'Error occurred. Please try again.';
        errorMessage.style.color = 'red';
        popup.appendChild(errorMessage);
    }
  
    // Close the popup and overlay after 5 seconds
    // setTimeout(() => {
    //     document.body.removeChild(overlay);
    //     document.body.removeChild(popup);
    // }, 5000);
}

  


function createSummary(){

    collectHrefs();
    getSummary(urls);

}  

const urls = [
    
  ];

function collectHrefs() {

    const newsBlock = document.getElementById('summuryHolder');

    const removeBlocks = newsBlock.getElementsByClassName('remove_block');
    
    for (let i = 0; i < removeBlocks.length; i++) {
        const links = removeBlocks[i].getElementsByTagName('a');
        for (let j = 0; j < links.length; j++) {
            urls.push(links[j].href); 
        }
    }
    console.log(urls)
}


function removeSummary(urlToRemove) {
    const index = urls.indexOf(urlToRemove);
    if (index > -1) {
        urls.splice(index, 1); // Remove the URL from the array
        console.log(`Removed URL: ${urlToRemove}`); // Log removed URL
    } else {
        console.log(`URL not found: ${urlToRemove}`); // Log if not found
    }
    console.log(urls)
}