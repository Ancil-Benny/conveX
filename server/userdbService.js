const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

class userDbService {
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
            const query = "SELECT * FROM user WHERE email = ? AND password = ?";
            const results = await this.executeQuery(query, [email, password]);

            if (results.length > 0) {
                return { success: true, userId: results[0].userId, username: results[0].username };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insertUser(username, email, password) {
        try {
            const checkQuery = "SELECT * FROM user WHERE email = ?";
            const users = await this.executeQuery(checkQuery, [email]);

            if (users.length > 0) {
                throw new Error('A user with this email already exists.');
            }

            const insertQuery = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
            await this.executeQuery(insertQuery, [username, email, password]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*----------------------------------------------------------------*/
    async getSliderData(userId) {
        try {
            const query = "SELECT events.*, Register.evtid AS registeredEventId FROM events LEFT JOIN Register ON events.evtid = Register.evtid AND Register.userId = ?";
            const results = await this.executeQuery(query, [userId]);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
/*------------------------------------------------------------------*/
async registerUser(mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate) {
    try {
        const query = "INSERT INTO Register (mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await this.executeQuery(query, [mgtId, evtid, username, userId, email, evtname, evttype, evtdate, evtLdate]);


        // successfully registering the user, increment the 'evtbooked' column by 1 in the 'events' table
        const incrementQuery = "UPDATE events SET evtbooked = evtbooked + 1 WHERE evtid = ?";
        await this.executeQuery(incrementQuery, [evtid]);
        //------

         const getEventQuery = "SELECT * FROM events WHERE evtid = ?";
         const updatedEvent = await this.executeQuery(getEventQuery, [evtid]);

         return updatedEvent[0];
     //----------------------------------------------------
    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*------------------------------------------------------------------*/
async getRegisteredEvents(userId) {
    try {
        const query = "SELECT * FROM Register WHERE userId = ?";
        const results = await this.executeQuery(query, [userId]);
        return results;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*------------------------------------------------------------------*/
// unregister user
async unregisterUser(evtid, userId) {
    try {
        const query = "DELETE FROM Register WHERE evtid = ? AND userId = ?";
        await this.executeQuery(query, [evtid, userId]);

         // After successfully unregistering the user, decrement the 'evtbooked' column by 1 in the 'events' table
         const decrementQuery = "UPDATE events SET evtbooked = evtbooked - 1 WHERE evtid = ?";
         await this.executeQuery(decrementQuery, [evtid]);


    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*-------------------------------------------------------------------*/
async updateUser(userId, username, email, password, userpicedit) {
    try {
        const updateQuery = "UPDATE user SET username = ?, email = ?, password = ?, userpicedit = ? WHERE userId = ?";
        await this.executeQuery(updateQuery, [username, email, password, userpicedit, userId]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
/*------------------------------------------------------------------*/
getuserImagePath(userId) {
    const query = 'SELECT userpicedit FROM user WHERE userId = ?';
    return this.executeQuery(query, [userId])
        .then(results => results[0])
        .catch(err => { throw err; });
}
/*------------------------------------------------------------------*/
}
module.exports = userDbService;
