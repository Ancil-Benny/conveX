const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

class mainDbService {
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

    async getAllEvents() {
        try {
            const query = "SELECT `evttype`, `evtdate` FROM events";
            const results = await this.executeQuery(query);

            return results.map(row => ({ date: row['evtdate'], title: row['evttype'] }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async searchEvents(query) {
        try {
            const sqlQuery = "SELECT `evtname`, `evttype` FROM events WHERE `evtname` LIKE ? OR `evttype` LIKE ?";
            const results = await this.executeQuery(sqlQuery, [`%${query}%`, `%${query}%`]);

            return results.map(row => ({ title: row['evtname'], type: row['evttype'] }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*-------------------------------------------------------------------*/
    async getTrandingSliderData() {
        try {
            const query = "SELECT evtpic, evttype, evtdate, evtname FROM events";
            const results = await this.executeQuery(query);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*---------------------------------------------------------------------*/
    async getAllAnnouncements() {
        try {
            const query = "SELECT `organiser_name`, `mgtId`, `notify`, `evtname`, `evttype` FROM `announcements`";
            const results = await this.executeQuery(query);
            return results;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    /*---------------------------------------------------------------------*/
}
module.exports = mainDbService;
