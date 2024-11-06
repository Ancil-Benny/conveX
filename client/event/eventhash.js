function initializeSlider() {
var TrandingSlider = new Swiper('.tranding-slider', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2.5,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 2500, // slides will change every 2.5 seconds
    disableOnInteraction: false, // autoplay will not stop after user's interaction
  },
  on: {
    slideChangeTransitionEnd: function () {
      updateSlideText(this);
    },
    sliderMove: function () {
      updateSlideText(this);
    },
    transitionEnd: function () {
      updateSlideText(this);
    }
  },
});
}
function updateSlideText(swiper) {
  var currentSlide = swiper.realIndex;
  var slideTextElement = document.getElementById('slide-text');
  fetch('http://localhost:5000/trandingSliderData')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              const item = data.data[currentSlide];
              const formattedDate = formatDate(item.evtdate);
              slideTextElement.innerText = `${item.evttype} - ${formattedDate}`;
          } else {
              console.error(data.error);
          }
      })
      .catch(error => {
          console.error(error);
      });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

//backbutton

let backButton = document.querySelector('.back-button');

backButton.addEventListener('click', function() {
    // Redirect to index.html
    window.location.href = '../index.html';
});