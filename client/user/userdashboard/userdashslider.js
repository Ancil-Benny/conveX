$(document).ready(function() {
  fetch(`http://localhost:5000/sliderData?userId=${localStorage.getItem('userId')}`)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              populateSlider(data.data);
          } else {
              console.error(data.error);
          }
      })
      .catch(error => {
          console.error(error);
      });
});
/*-----------------------------------------------------------------
made another one in table.js
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
---------------------------------*/
function populateSlider(data) {
  data.forEach(item => {
    let formattedEvtDate = formatDate(item.evtdate);
    let formattedEvtLDate = formatDate(item.evtLdate);})
  // Clear the slider
  $('.slider-wrapper').empty();

  // Add each item to the slider
  data.forEach(item => {
    let formattedEvtDate = formatDate(item.evtdate);
    let formattedEvtLDate = formatDate(item.evtLdate);
    let remainingSlots = item.evttickets - item.evtbooked;
    let registerButton = '';
    if (item.registeredEventId) {
      registerButton = '<span>Registered</span>';
    }
    else if(!item.registeredEventId && remainingSlots > 0) {
    registerButton = `<button class="slide-more"  data-mgtid="${item.mgtId}" data-evtid="${item.evtid}"data-evtname="${item.evtname}" data-evttype="${item.evttype}" data-evtdate="${item.evtdate}" data-evtLdate="${item.evtLdate}">REGISTER</button>`;
    }
  else {
    registerButton = '<span>No slots</span>';
  }
    $('.slider-wrapper').append(`
        <div class="slide flex">
            <div class="slide-image slider-link next"><img src="${item.evtpic}"  alt="${item.evtname}"><div class="overlay"></div></div>
            <div class="slide-content">
                <div class="slide-title">Title: ${item.evtname}</div>
                <div class="slide-type">Type: ${item.evttype}</div>
                <div class="slide-text">${item.evttext}</div>
                <div class="slide-date">Date of Event: ${formattedEvtDate}</div>
                <div class="slide-last-date">Last Date: ${formattedEvtLDate}</div>
                <div class="slide-slots">Slots left: ${remainingSlots}/${item.evttickets}</div>
                ${registerButton}
            </div>  
        </div>
      `);
  });
  
/*-----------------------------------------------------*/
 // Add event listener to the register buttons
 let registerbtn = document.querySelectorAll('.slide-more');

 registerbtn.forEach(function(button) {
   let timerId;

   button.addEventListener('click', function() {
       if (button.innerHTML === 'Confirm') {
           // Get the data
           const mgtId = button.getAttribute('data-mgtId');
           const evtid = button.getAttribute('data-evtid');
           const username = localStorage.getItem('username');
           const userId = localStorage.getItem('userId');
           const email = localStorage.getItem('useremail');
           /*--------------------------------------------*/
          const evtname = button.getAttribute('data-evtname');
          const evttype = button.getAttribute('data-evttype');
          let evtdate = button.getAttribute('data-evtdate');
          let evtLdate = button.getAttribute('data-evtLdate');

           // Format the dates
          /* evtdate = formatDate(evtdate);
           evtLdate = formatDate(evtLdate);*/

           // Make a POST request to the /register endpoint
           fetch('http://localhost:5000/register', {
               method: 'POST', 
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate}),
           })
           .then(response => response.json())
           .then(data => {
               if (data.success) {
                  
                showAlert('success', 'SUCCESS', 'Registeration sucessful.');
                   button.style.display = 'none'; // Add this line to hide the button
                   /*button.innerHTML = 'Unregister';
                   button.classList.remove('confirm'); // Change color back to original*/
                   // Add this line to hide the button
                    // Create a new element, set its text content to "Registered", and add it to the parent of the button
        let registeredText = document.createElement('span');
        registeredText.textContent = 'Registered';
        button.parentNode.appendChild(registeredText);

               //-----------------------------------------------
  // Function to handle unregister button click
function handleUnregisterButtonClick(event) {
  let button = event.target;
  let timerId;

  if (button.innerHTML === 'Confirm') {
      // Get the 'evtid' and 'userId'
      const evtid = button.parentElement.querySelector('.col-1').textContent;
      const userId = localStorage.getItem('userId');

      // Send DELETE request to '/unregister' with 'evtid' and 'userId'
      fetch('http://localhost:5000/unregister', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ evtid, userId }),
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Remove row from table
              button.parentElement.remove();

              
    showAlert('success', 'SUCCESS', 'Event is sucessfully Unregistered.', () => location.reload(true));
              // Refresh the page
             
          } else {
              console.error(data.error);
          }
      })
      .catch(error => {
          console.error(error);
      });
  } else {
      button.innerHTML = 'Confirm';
      // If not clicked within 5 seconds, revert back to original state
      timerId = setTimeout(function() {
          button.innerHTML = 'UNREGISTER';
      }, 3000);
  }

  button.addEventListener('mousedown', function() {
      clearTimeout(timerId);
  });
}

// Add a row to the front-end table
$('.userresponsive-table').append(`
<li class="usertable-row">
    <div class="col col-1" data-label="Event Id">${evtid}</div>
    <div class="col col-2" data-label="Event Name">${evtname}</div>
    <div class="col col-3" data-label="Event type">${evttype}</div>
    <div class="col col-4" data-label="Date of Event">${formatDate(evtdate)}</div>
    <button class="col col-5 unregister-button">UNREGISTER</button>
</li>
`);

// Add event listener to 'Unregister' buttons
$('.userresponsive-table').on('click', '.unregister-button', handleUnregisterButtonClick);
    
               //------------------------------------------------
                 // Update the slide with the new data
        const slide = button.closest('.slide');
        const remainingSlots = data.updatedEvent.evttickets - data.updatedEvent.evtbooked;
        slide.querySelector('.slide-slots').textContent = `Slots left: ${remainingSlots}/${data.updatedEvent.evttickets}`;
    } else {
        console.error(data.error);
    }
})
               //----------------------------------------------
                 
           .catch(error => {
               console.error(error);
               alert('Registration failed: ' + data.error);
           });
       } else {
           button.innerHTML = 'Confirm';
           button.classList.add('confirm'); // Change color to red
           // If not clicked within 5 seconds, revert back to original state
           timerId = setTimeout(function() {
               button.innerHTML = 'REGISTER';
               button.classList.remove('confirm'); // Change color back to original
           }, 3000);
       }
   });

   button.addEventListener('mousedown', function() {
       clearTimeout(timerId);
   });
 });
// Re-initialize the slider
  initializeSlider();
}

/*-----------------------------------------------------*/
function initializeSlider() { 
  
  var isPaused = false; 
    var s           = $('.slider'),
        sWrapper    = s.find('.slider-wrapper'),
        sItem       = s.find('.slide'),
        btn         = s.find('.slider-link'),
        sWidth      = sItem.width(),
        sCount      = sItem.length,
        slide_date  = s.find('.slide-date'),
        slide_Ldate  = s.find('.slide-last-date'),
        slide_title = s.find('.slide-title'),
        slide_text  = s.find('.slide-text'),
        slide_more  = s.find('.slide-more'),
        slide_image = s.find('.slide-image img'),
        sTotalWidth = sCount * sWidth;
    
    sWrapper.css('width', sTotalWidth);
    sWrapper.css('width', sTotalWidth);
    
    var clickCount  = 0;
    var intervalId; // Variable to hold the interval ID

    // Function to go to the next slide
    function goToNextSlide(isUserAction) {
    if (!isPaused || isUserAction) {
      clickCount < (sCount - 1) ? clickCount++ : clickCount = 0;
      TweenMax.to(sWrapper, 0.4, {x: '-' + (sWidth * clickCount)});

   
      // Content animations
      var fromProperties = {autoAlpha:0, x:'-50', y:'-10'};
      var toProperties = {autoAlpha:0.8, x:'0', y:'0'};

      TweenLite.fromTo(slide_image, 1, {autoAlpha:0, y:'120'}, {autoAlpha:1, y:'0'});
      TweenLite.fromTo(slide_date, 0.4, fromProperties, toProperties);
      TweenLite.fromTo(slide_Ldate, 0.4, fromProperties, toProperties);
      TweenLite.fromTo(slide_title, 0.6, fromProperties, toProperties);
      TweenLite.fromTo(slide_text, 0.8, fromProperties, toProperties);
      TweenLite.fromTo(slide_more, 0.5, fromProperties, toProperties);
    }
  }
     // Function to go to the previous slide
     function goToPrevSlide(isUserAction) {
      if (!isPaused || isUserAction) {
        clickCount > 0 ? clickCount-- : clickCount = sCount - 1;
        TweenMax.to(sWrapper, 0.4, {x: '-' + (sWidth * clickCount)});

         // Content animations
      var fromProperties = {autoAlpha:0, x:'-50', y:'-10'};
      var toProperties = {autoAlpha:0.8, x:'0', y:'0'};

      TweenLite.fromTo(slide_image, 1, {autoAlpha:0, y:'-80'}, {autoAlpha:1, y:'0'});
      TweenLite.fromTo(slide_date, 0.4, fromProperties, toProperties);
      TweenLite.fromTo(slide_Ldate, 0.4, fromProperties, toProperties);
      TweenLite.fromTo(slide_title, 0.6, fromProperties, toProperties);
      TweenLite.fromTo(slide_text, 0.8, fromProperties, toProperties);
      TweenLite.fromTo(slide_more, 0.5, fromProperties, toProperties);
      }
    }
  

  $('.slider-link.next').on('click', function(e) {
    e.preventDefault();
    goToNextSlide(true); // Pass 'true' to indicate this is a user action
  });
    // Start auto-play when the page loads
    intervalId = setInterval(goToNextSlide, 3000); // Change '3000' to the number of milliseconds you want between each slide

    // Pause the slider when the mouse is over it
  s.mouseover(function() {
    isPaused = true;
  });

   // Resume the slider when the mouse leaves it
  s.mouseout(function() {
    isPaused = false;
  });

  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left arrow key
        goToPrevSlide(true);
        break;
  
      case 39: // right arrow key
        goToNextSlide(true);
        break;
  
      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

    btn.on('click', function(e) {
      e.preventDefault();

      if($(this).hasClass('next')) {
        goToNextSlide();
      } else if ($(this).hasClass('prev')) {
        clickCount > 0 ? clickCount-- : clickCount = sCount - 1;
        TweenMax.to(sWrapper, 0.4, {x: '-' + (sWidth * clickCount)});
      }
    });
        
  }
(jQuery);

function showAlert(icon, title, text, callback) {
  Swal.fire({
      icon: icon,
      title: title,
      text: text,
  }).then(callback);
}