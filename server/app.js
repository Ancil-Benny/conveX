const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
/*===================================================================================*/
//1
const mainDbService = require('./maindbService'); //* dbService
const maindb = new mainDbService();

//--------------------------------

app.get('/events', (request, response) => {
    maindb.getAllEvents()
        .then(data => response.json(data))
        .catch(err => response.json({ success: false, error: err.message }));
});

app.get('/search', (request, response) => {
    const { query } = request.query;
    maindb.searchEvents(query)
        .then(data => response.json(data))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------------------*/
app.get('/trandingSliderData', (request, response) => {
    maindb.getTrandingSliderData()
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------------------*/
app.get('/announcements', (request, response) => {
    maindb.getAllAnnouncements()
        .then(data => response.json(data))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------------------*/
/*============================================================================*/
//2
const orgDbService = require('./orgdbService'); //* dbService
const orgdb = new orgDbService();
//----------------------------------
app.post('/login', (request, response) => {
    const { email, password } = request.body;

    orgdb.checkCredentials(email, password)
        .then(data => {

            response.json({ success: data.success, mgtId: data.mgtId, organiser_name: data.organiser_name });
})
            .catch(err => response.json({ success: false, error: err.message }));
});

app.post('/signup', (request, response) => {
    const { mgtId, email, password, organiser_name} = request.body;

    orgdb.insertUser(mgtId, email, password, organiser_name)
        .then(data => response.json({ success: true }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.post('/addevent', (request, response) => {
    const { evtname, evttype, evtdate, evtLdate, evttickets, evttext, mgtId, organiser_name,evtpic } = request.body;

    orgdb.insertEvent(evtname, evttype, evtdate, evtLdate, evttickets, evttext, mgtId, organiser_name, evtpic)
        .then(data => response.json({ success: true, eventData: data })) // Include the event data in the response
        .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.post('/addannouncement', (request, response) => {

    const { mgtId, organiser_name, evtname, evttype, notify } = request.body;

    orgdb.insertAnnouncement(mgtId, organiser_name, evtname, evttype, notify)
        .then(data => response.json({ success: true }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.post('/update', (request, response) => {
    const {mgtId, organiser_name, email, password, picedit } = request.body;

    orgdb.updateUser(mgtId, organiser_name, email, password, picedit)
        .then(email => response.json({ success: true, email }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------*/
app.get('/getImagePath', (request, response) => {
    const { mgtId } = request.query;

    orgdb.getImagePath(mgtId)
        .then(data => response.json({ success: true, picedit: data.picedit }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------*/
app.get('/registeredEvents', (request, response) => {
    const mgtId = request.query.mgtId;
    orgdb.getRegisteredEvents(mgtId)
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*------------------------------------------------------------*/
//data.html
app.get('/getEventDetails', (request, response) => {
    const mgtId = request.query.mgtId;
    const evtid = request.query.evtid;
    orgdb.getEventDetails(mgtId, evtid)
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*------------------------------------------------------------*/
app.delete('/deleteEvent', (request, response) => {
    const { mgtId, evtid, organiser_name, evtname, evttype } = request.body;
    orgdb.deleteEvent(mgtId, evtid, organiser_name, evtname, evttype)
        .then(() => response.json({ success: true }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*------------------------------------------------------------*
/*==============================================================================*/
//3.
const userDbService = require('./userdbService'); //* dbService
const userdb = new userDbService();
//-----------------------------------------------

app.post('/userlogin', (request, response) => {
    const { email, password } = request.body;

    userdb.checkCredentials(email, password)
    .then(data => {
        response.json({ success: data.success, userId: data.userId, username: data.username })
    })
        .catch(err => response.json({ success: false, error: err.message }));
});

app.post('/usersignup', (request, response) => {
    const { username, email, password } = request.body;

    userdb.insertUser(username, email, password)
        .then(data => response.json({ success: true }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.get('/sliderData', (request, response) => {
    const userId = request.query.userId;
    userdb.getSliderData(userId)
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.post('/register', (request, response) => {
    const { mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate } = request.body;

    userdb.registerUser(mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate)
        .then(updatedEvent => response.json({ success: true, updatedEvent: updatedEvent }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*------------------------------------------------------------*/
app.get('/userregisteredEvents', (request, response) => {
    const userId = request.query.userId;
    userdb.getRegisteredEvents(userId)
        .then(data => response.json({ success: true, data: data }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*------------------------------------------------------------*/
// Route handler for '/unregister'
app.delete('/unregister', (request, response) => {
    const { evtid, userId } = request.body;

    userdb.unregisterUser(evtid, userId)
    .then(() => {
        response.json({ success: true });
    })
    .catch(err => response.json({ success: false, error: err.message }));
});
/*---------------------------------------------------------*/
app.post('/userupdate', (request, response) => {
    const {userId, username, email, password, userpicedit } = request.body;

    userdb.updateUser(userId, username, email, password, userpicedit)
        .then(() => response.json({ success: true, username: username, useremail: email }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*----------------------------------------------------------*/
app.get('/getuserImagePath', (request, response) => {
    const { userId } = request.query;

    userdb.getuserImagePath(userId)
        .then(data => response.json({ success: true, picedit: data.userpicedit }))
        .catch(err => response.json({ success: false, error: err.message }));
});
/*-----------------------------------------------------------*/
/*===============================================================================*/
/*===============================================================================*/
app.listen(process.env.PORT, () => console.log('2023 blanc  \n Server is running... '));
