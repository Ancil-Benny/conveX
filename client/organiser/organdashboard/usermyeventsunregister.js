
//-----------------------------------------------------------------------
$(document).ready(function() {
    const mgtId = localStorage.getItem('mgtId');
    fetch(`http://localhost:5000/registeredEvents?mgtId=${localStorage.getItem('mgtId')}`)
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
                <div class="col col-2" data-label="Event Date">${formatDate(item.evtdate)}</div>
                <div class="col col-3" data-label="Event Last Date">${formatDate(item.evtLdate)}</div>
                <div class="col col-4" data-label="Date of Event">${(item.evtbooked)}/${(item.evttickets)}</div>
                <button class="col col-5 more">MORE</button>
            </li>
        `);
    });

//--------------------------------------------------------------------------
  // Add event listener to 'Unregister' buttons
  let unregisterButtons = document.querySelectorAll('.more');

  unregisterButtons.forEach(function(button) {
      let timerId;

      button.addEventListener('click', function() {
          
              // Get the 'evtid' and 'mgtId'
              const evtid = button.parentElement.querySelector('.col-1').textContent;
              const mgtId = localStorage.getItem('mgtId');
              localStorage.setItem('evtid', evtid); 
              window.location.href = 'userdata/data.html';

          });
      });
    }