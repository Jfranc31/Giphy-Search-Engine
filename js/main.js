// Giphy API Configuration
const API_KEY = 'd1qzMW1khicR5N94lVUswpBQOAyetULR';
const API_URL = 'https://api.giphy.com/v1/gifs/search';
const GIFS_PER_PAGE = 12;

let currentPage = 1;
let currentQuery = '';
let totalGifs = 0;

// Get DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results');
const statusMessage = document.getElementById('status-message');

// Get inline pagination elements (top)
const inlinePagination = document.getElementById('inline-pagination');
const prevArrow = document.getElementById('prev-arrow');
const nextArrow = document.getElementById('next-arrow');
const pageNumber = document.getElementById('page-number');

// Get bottom pagination elements
const bottomPaginationSection = document.getElementById('bottom-pagination-section');
const prevBtnBottom = document.getElementById('prev-btn-bottom');
const nextBtnBottom = document.getElementById('next-btn-bottom');
const pageInfoBottom = document.getElementById('page-info-bottom');

// Event Listener for form submission
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        showStatus('Please enter a search term');
        return;
    }

    currentPage = 1;
    currentQuery = searchTerm;
    searchGifs(searchTerm, currentPage);

});

// Function to go to previous page
function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        searchGifs(currentQuery, currentPage);
        scrollToTop();
    }
}

// Function to go to next page
function goToNextPage() {
    const totalPages = Math.ceil(totalGifs / GIFS_PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        searchGifs(currentQuery, currentPage);
        scrollToTop();
    }
}

// Event listeners for inline pagination (top)
prevArrow.addEventListener('click', goToPreviousPage);
nextArrow.addEventListener('click', goToNextPage);

// Event listeners for bottom pagination
prevBtnBottom.addEventListener('click', goToPreviousPage);
nextBtnBottom.addEventListener('click', goToNextPage);

// Function to search GIFs
function searchGifs(query, page) {
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
    showStatus('Loading GIFs...', 'loading');
    clearResults();

    // Calculate offset for pagination
    const offset = (page - 1) * GIFS_PER_PAGE;

    // Build API URL with parameters
    const url = `${API_URL}?api_key=${API_KEY}&q=${query}&limit=${GIFS_PER_PAGE}&offset=${offset}`;

    // Make API request
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            totalGifs = data.pagination.total_count;
            displayGifs(data.data);
            updatePagnination();
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

    showStatus('', 'success');

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

// Function to update pagination controls (top and bottom)
function updatePagnination() {
    const totalPages = Math.ceil(totalGifs / GIFS_PER_PAGE);

    // Show or hide pagination based on total pages
    if (totalPages > 1) {
        // Show top pagination
        inlinePagination.style.display = 'flex';
        pageNumber.textContent = currentPage;
        prevArrow.disabled = currentPage === 1;
        nextArrow.disabled = currentPage === totalPages;

        // Show bottom pagination
        bottomPaginationSection.style.display = 'block';
        pageInfoBottom.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtnBottom.disabled = currentPage === 1;
        nextBtnBottom.disabled = currentPage === totalPages;
    } else {
        // Hide both paginations if only one page
        inlinePagination.style.display = 'none';
        bottomPaginationSection.style.display = 'none';
    }
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

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}