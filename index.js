const mysql = require("mysql2");
const express = require("express");
var app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
    multipleStatements: true

});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Database connected")
    } else {
        console.log("Dtabase connection failed \n Error : " + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3000, () => console.log("Express is running on port: 3000"));

// Get all data
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM new_table', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err)
        }
    });
});

// Get an employee
app.get('/employees/:id', (req, res) => {
    mysqlConnection.query(`SELECT * FROM new_table WHERE EmpID =${req.params.id}`, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err)
        }
    });
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query(`DELETE FROM new_table WHERE EmpID = ${req.params.id}`, (err, rows, fields) => {
        if (!err) {
            res.send('Deleted Sucessfully');
        } else {
            console.log(err)
        }
    });
});

// Insert an employee
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('Inserted employee id : ' + element[0].EmpID);
            });
        else
            console.log(err);
    })
});

// Update an employee
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpID = ?;SET @Name = ?;SET @EmpCode = ?;SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send("Updated Successfully");
        else
            console.log(err);
    })
});









