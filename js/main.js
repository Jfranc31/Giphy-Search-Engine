// Giphy API Configuration
const API_KEY = 'd1qzMW1khicR5N94lVUswpBQOAyetULR';
const API_URL = 'https://api.giphy.com/v1/gifs/search';

// Get DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results');
const statusMessage = document.getElementById('status-message');

// Event Listener for form submission
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        showStatus('Please enter a search term');
        return;
    }

    searchGifs(searchTerm);

});

// Function to search GIFs
function searchGifs(query) {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    // Show loading message
    showStatus('Loading GIFs...', 'loading');
    clearResults();

    // Build API URL with parameters
    const url = `${API_URL}?api_key=${API_KEY}&q=${query}&limit=12`;

    // Make API request
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayGifs(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            showStatus('Error fetching GIFs. Please try again.', 'error');
        })
        .finally(() => {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Search';
        });
}

// Function to display GIFS per page
function displayGifs(gifs) {
    clearResults();

    if (gifs.length === 0) {
        showStatus('No GIFs found. Try a different search.', 'error');
        return;
    }

    showStatus(`Found ${gifs.length} GIFs`, 'success');

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'gif-grid';

    // Add each GIF to the grid
    gifs.forEach(gif => {
        const gifUrl = gif.images.fixed_height.url;
        const gifTitle = gif.title || 'GIF';

        // Create column wrapper
        const colDiv = document.createElement('div');
        colDiv.className = 'col-3';

        // Create GIF item
        const gifItem = document.createElement('div');
        gifItem.className = 'gif-item';

        // Create image
        const img = document.createElement('img');
        img.src = gifUrl;
        img.alt = gifTitle;
        img.loading = 'lazy';

        // Append elements
        gifItem.appendChild(img);
        colDiv.appendChild(gifItem);
        gridContainer.appendChild(colDiv);
    });

    resultsSection.appendChild(gridContainer);
}

// Function to show status messages
function showStatus(message, type = '') {
    statusMessage.textContent = message;
    statusMessage.className = type;
}

// Function to clear results
function clearResults() {
    resultsSection.innerHTML = '';
}

// Clear status message when user starts typing
searchInput.addEventListener('input', function() {
    if (statusMessage.textContent) {
        showStatus('');
    }
});