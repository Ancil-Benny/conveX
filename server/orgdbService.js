const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

class orgDbService {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT
        });

        this.connection.connect((err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    async executeQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    resolve(results);
                }
            });
        });
    }

    async checkCredentials(email, password) {
        try {
            const query = "SELECT * FROM organiser WHERE email = ? AND password = ?";
            const results = await this.executeQuery(query, [email, password]);

            if (results.length > 0) {

                return { success: true, mgtId: results[0].mgtId, organiser_name: results[0].organiser_name };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insertUser(mgtId, email, password, organiser_name) {
        try {
            const checkQuery = "SELECT * FROM organiser WHERE email = ?";
            const users = await this.executeQuery(checkQuery, [email]);

            if (users.length > 0) {
                throw new Error('A user with this email already exists.');
            }

            const insertQuery = "INSERT INTO organiser (mgtId, email, password, organiser_name) VALUES (?, ?, ?, ?)";
            await this.executeQuery(insertQuery, [mgtId, email, password, organiser_name]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
   //----------------------------------------------------------------------------------
    async insertEvent(evtname, evttype, evtdate, evtLdate, evttickets, evttext, mgtId, organiser_name, evtpic) {
        try {
            const insertQuery = "INSERT INTO events (evtname, evttype, evtdate, evtLdate, evttickets, evttext, mgtId, organiser_name, evtpic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            await this.executeQuery(insertQuery, [evtname, evttype, evtdate, evtLdate, evttickets, evttext, mgtId, organiser_name, evtpic]);
             // Get the inserted event's data
 // Get the inserted event's data
const selectQuery = "SELECT evtid, evtname, evttype, organiser_name FROM events WHERE evtname = ? AND evttype = ? AND mgtId = ?";
const result = await this.executeQuery(selectQuery, [evtname, evttype, mgtId]);
return result[0]; // Return the first (and only) row
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
//--------------------------------------------------------------------------------------------
/*async insertAnnouncement( mgtId, organiser_name, evtname, evttype, notify) {
    try {
        const insertQuery = "INSERT INTO announcements (mgtId, organiser_name, evtname, evttype, notify) VALUES (?, ?, ?, ?, ?)";
        await this.executeQuery(insertQuery, [mgtId, organiser_name, evtname, evttype, notify]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}*/
//==================================================================================
//try this in later version:
async insertAnnouncement(mgtId, organiser_name, evtname, evttype, notify) {
    try {
        // Check the number of rows in the table
        const countQuery = "SELECT COUNT(*) AS count FROM announcements";
        const countResult = await this.executeQuery(countQuery);
        const count = countResult[0].count;

        // If the number of rows is 5 or more, delete the oldest row
        if (count >= 5) {
            const deleteQuery = "DELETE FROM announcements WHERE countno = (SELECT MIN(countno) FROM announcements)";
            await this.executeQuery(deleteQuery);
        }

        // Insert the new row
        const insertQuery = "INSERT INTO announcements (mgtId, organiser_name, evtname, evttype, notify) VALUES (?, ?, ?, ?, ?)";
        await this.executeQuery(insertQuery, [mgtId, organiser_name, evtname, evttype, notify]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

//--------------------------------------------------------------------------------------------------
    async updateUser(mgtId, organiser_name, email, password, picedit) {
        try {
            const updateQuery = "UPDATE organiser SET organiser_name = ?, email = ?, password = ?, picedit = ? WHERE mgtId = ?";
            await this.executeQuery(updateQuery, [organiser_name, email, password, picedit, mgtId]);

              // Get the updated user data
              const emailQuery = "SELECT email FROM organiser WHERE mgtId = ?";
              const results = await this.executeQuery(emailQuery, [mgtId]);
      
              return results[0].email; 
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*----------------------------------------------------------*/
    async getRegisteredEvents(mgtId) {
        try {
            const query = "SELECT * FROM events WHERE mgtId = ?";
            const results = await this.executeQuery(query, [mgtId]);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*-----------------------------------------------*/
    async getImagePath(mgtId) { //sync added
        const query = 'SELECT picedit FROM organiser WHERE mgtId = ?';
        return this.executeQuery(query, [mgtId])
            .then(results => results[0])
            .catch(err => { throw err; });
    }
/*---------------------------------------------------*/
async getEventDetails(mgtId, evtid) { //data.html/table
    try {
        const eventQuery = "SELECT * FROM events WHERE mgtId = ? AND evtid = ?";
        const registerQuery = "SELECT * FROM register WHERE mgtId = ? AND evtid = ?";

        const register = await this.executeQuery(registerQuery, [mgtId, evtid]);

        if (register.length > 0) {
            return register;
        } else {
            const event = await this.executeQuery(eventQuery, [mgtId, evtid]);
            return [{
                evtname: event[0].evtname,
                evttype: event[0].evttype
            }];
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*--------------------------------------------------*/
async deleteEvent(mgtId, evtid, organiser_name, evtname, evttype) {
    try {
        const deleteEventQuery = "DELETE FROM events WHERE mgtId = ? AND evtid = ?";
        const deleteRegisterQuery = "DELETE FROM register WHERE mgtId = ? AND evtid = ?";
        const insertAnnouncementQuery = "INSERT INTO announcements (mgtId, organiser_name, evtname, evttype, notify) VALUES (?, ?, ?, ?, 'discarded')";

        await this.executeQuery(deleteEventQuery, [mgtId, evtid]);
        await this.executeQuery(deleteRegisterQuery, [mgtId, evtid]);

        // Check the number of rows in the announcements table
        const countQuery = "SELECT COUNT(*) AS count FROM announcements";
        const countResult = await this.executeQuery(countQuery);
        const count = countResult[0].count;

        // If the number of rows is 5 or more, delete the oldest row
        if (count >= 5) {
            const deleteQuery = "DELETE FROM announcements WHERE countno = (SELECT MIN(countno) FROM announcements)";
            await this.executeQuery(deleteQuery);
        }

        // Insert the new row into the announcements table
        await this.executeQuery(insertAnnouncementQuery, [mgtId, organiser_name, evtname, evttype]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*=========================================================================================*/
/*old one
async deleteEvent(mgtId, evtid, organiser_name, evtname, evttype) {
    try {
        const deleteEventQuery = "DELETE FROM events WHERE mgtId = ? AND evtid = ?";
        const deleteRegisterQuery = "DELETE FROM register WHERE mgtId = ? AND evtid = ?";
        const insertAnnouncementQuery = "INSERT INTO announcements (mgtId, organiser_name, evtname, evttype, notify) VALUES (?, ?, ?, ?, 'discarded')";

        await this.executeQuery(deleteEventQuery, [mgtId, evtid]);
        await this.executeQuery(deleteRegisterQuery, [mgtId, evtid]);
        await this.executeQuery(insertAnnouncementQuery, [mgtId, organiser_name, evtname, evttype]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}*/
/*---------------------------------------------------*/
}
module.exports = orgDbService;
