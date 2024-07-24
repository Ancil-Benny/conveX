// LOADING SCREEN
const progressBar = document.getElementById('progress-bar');
const counter = document.getElementById('progress-counter');
const loadingScreen = document.getElementById('loading-screen');
const mainSection = document.querySelector('.part1');
const image = document.querySelector('.background img');

function updateProgress(progress) {
  progressBar.style.width = `${progress}%`;
  counter.textContent = `${progress}%`;
}

// Check if the page has been loaded before
if (sessionStorage.getItem('isReloaded')) {
  updateProgress(0);
  // document.body.style.overflow = 'hidden';

  let progress = 0;
  const increment = 10;

  const updateLoop = setInterval(() => {
    if (progress >= 100) {
      clearInterval(updateLoop);
    }
    updateProgress(progress);
    progress += increment;
  }, 50);

  if (image.complete) {
    hideLoader();
    document.body.style.overflowY = 'auto'; // Set overflow property here
  } else {
    image.addEventListener('load', () => {
      hideLoader();
      document.body.style.overflowY = 'auto'; // Set overflow property here
    });
  }
} else {
  // If the page hasn't been loaded before, set the 'isReloaded' item in sessionStorage
  sessionStorage.setItem('isReloaded', true);
  loadingScreen.style.display = 'none';
}

function hideLoader() {
  setTimeout(() => {
    loadingScreen.style.display = 'none'; 
    mainSection.style.opacity = '1';
  }, 500);
}