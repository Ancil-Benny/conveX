$(document).ready(function() {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:5000/userregisteredEvents?userId=${localStorage.getItem('userId')}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                populateTable(data.data);
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error(error);
        });
});
//---------------------------------------------------------------
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
//---------------------------------------------------------------------

function populateTable(data) {
    // Clear the table rows
    $('.usertable-row').remove();

    // Add each item to the table
    data.forEach(item => {
        $('.userresponsive-table').append(`
            <li class="usertable-row">
                <div class="col col-1" data-label="Event Id">${item.evtid}</div>
                <div class="col col-2" data-label="Event Name">${item.evtname}</div>
                <div class="col col-3" data-label="Event type">${item.evttype}</div>
                <div class="col col-4" data-label="Date of Event">${formatDate(item.evtdate)}</div>
                <button class="col col-5 unregister-button">UNREGISTER</button>
            </li>
        `);
    });

//--------------------------------------------------------------------------
  // Add event listener to 'Unregister' buttons
  let unregisterButtons = document.querySelectorAll('.unregister-button');

  unregisterButtons.forEach(function(button) {
      let timerId;

      button.addEventListener('click', function() {
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

                      showAlert('success', 'SUCCESS', 'Event is successfully Unregistered.', () => location.reload(true));
                      // Refresh the page
                       // Re-fetch data and re-initialize slider
                      /* fetchData().then(data => populateSlider(data.data)).catch(error => console.error('Failed to initialize slider:', error));*/
    
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
      });

      button.addEventListener('mousedown', function() {
          clearTimeout(timerId);
      });
  });
}