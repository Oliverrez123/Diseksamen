const mysql2 = require('mysql2')

const database = mysql2.createConnection({
    user: 'Oliverrez',
    password: "AVNS_aBleA_r7j8oZ5oyXC4D",
    host: "db-mysql-fra1-84843-do-user-13098075-0.b.db.ondigitalocean.com",
    port: 25060,
    database: "kanbandb",
    //sslmode: "REQUIRED"

}
)

database.connect((err) =>{
    if (err) {
        console.log("der er fejl: " + err.message);
        return;
    }
    console.log("Velkommen");
}
)

module.exports = database;
