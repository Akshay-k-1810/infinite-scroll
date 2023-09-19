const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isReady = false;
let imagesLoadedCount = 0;
let totalImagesCount = 0;
let photosArray = [];
var offset = 0; // Initial offset
function imageLoaded() {
  imagesLoadedCount++;
  if (imagesLoadedCount === totalImagesCount) {
    isReady = true;
    loader.style.display = 'none'; // Hide the loader when all images are loaded
  }
}

function createImageElement(photo) {
  const imageItem = document.createElement('div');
  imageItem.classList.add('image-item');

  const img = document.createElement('img');
  img.src = photo.url;
  img.alt = photo.description;

  imageItem.appendChild(img);

  imageContainer.appendChild(imageItem);
}

async function fetchPhotos() {
  try {
    const response = await fetch(
      `https://api.slingacademy.com/v1/sample-data/photos?offset=${offset}&limit=5`
    );
    offset += 5; // Increment the offset by 5
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    const newPhotosArray = data.photos;
    photosArray = [...photosArray, ...newPhotosArray];
    totalImagesCount = photosArray.length;

    newPhotosArray.forEach((photo) => {
      createImageElement(photo);
    });

    isReady = true;
    loader.style.display = 'none'; // Hide the loader when all images are loaded
  } catch (error) {
    alert(`Error in Retrieving Images: ${error.message}`);
  }
}

// Check to see if scrolling near the bottom of the page, load more photos
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000 &&
    isReady
  ) {
    isReady = false;
    fetchPhotos();
  }
});

// On Load
fetchPhotos();
