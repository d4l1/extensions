const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const imageGallery = document.getElementById('imageGallery');

let currentPage = 1;
const perPage = 10;

chrome.storage.local.get(['lastSearch'], function(result) {
  if (result.lastSearch) {
    searchInput.value = result.lastSearch;
    searchImages(result.lastSearch);
  }
});

searchButton.addEventListener('click', () => {
  const query = searchInput.value;
  searchImages(query);
  chrome.storage.local.set({ 'lastSearch': query });
});

async function searchImages(query) {
  currentPage = 1;
  const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&page=${currentPage}`, {
    headers: {
      'Authorization': 'mGNHsfeAi2KRr2PP6bZY07ULrDKpfTkV4mCOZ0ohRK9O5lwrHJm2DMDo'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch images from Pexels.');
  }

  const data = await response.json();
  renderImages(data.photos || []);
}

function renderImages(images) {
  imageGallery.innerHTML = '';

  for (const image of images) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';

    const imgElement = document.createElement('img');
    imgElement.src = image.src.medium;
    imgElement.className = 'gallery-image';
    imgElement.alt = image.alt;

    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download';
    downloadButton.className = 'download-button';
    downloadButton.addEventListener('click', () => {
      downloadImage(image.src.original, image.alt);
    });

    imgContainer.appendChild(imgElement);
    imgContainer.appendChild(downloadButton);
    imageGallery.appendChild(imgContainer);
  }
}

function downloadImage(url, filename) {
  chrome.downloads.download({
    url: url,
    filename: filename + '.jpg'
  });
}
