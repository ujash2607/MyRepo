const pool = require("../database/db");


const getUser = async(req, res) => {
    const { first_name, last_name, city, page = 1, limit = 10 } = req.query;

     let query = 'SELECT * FROM users WHERE 1=1';
    const queryParams = [];

    if (first_name) {
        queryParams.push(`%${first_name}%`);
        query += ` AND firstname ILIKE $${queryParams.length}`;
    }
    if (last_name) {
        queryParams.push(`%${last_name}%`);
        query += ` AND lastname ILIKE $${queryParams.length}`;
    }
    if (city) {
        queryParams.push(`%${city}%`);
        query += ` AND city ILIKE $${queryParams.length}`;
    }

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, (page - 1) * limit);

    try {
        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const userById = async(req, res) => {

    const {id} = req.params;
    let text, values;

    try {
        text = `SELECT * FROM users WHERE id = $1`;
        values = [id];

        const result = await pool.query(text, values);
        console.log(result.rows, 'result here >>>>');
        res.status(200).send({success: true, message: "Result", data : result.rows});

    } catch (error) {
        console.log(error, 'error here')
        res.status(500).send({success: false , msg: "Internal server error"});
    }
}


const uniqueCity = async(req, res) => {
    try {
        let text = `SELECT city, COUNT(*) as count FROM users GROUP BY city`;
        
        const result = await pool.query(text);
        console.log(result.rows, 'result here >>>');
        res.status(200).send({success: true, msg: "Data here", data: result.rows });

    } catch (error) {
        console.log(error, 'error here ....');
        res.status(500).send({success: false, msg: "error here"});
    }
}

const addData = async(req, res) => {
    try {
        let text , values;
        const {firstname, lastname, city, company } = req.body;

        
        text = `SELECT * FROM users WHERE city = $1 AND company = $2`;
        values = [city, company];
        
        const existData = await pool.query(text, values);
        
        if(existData.rows.length > 0 ) {
            console.log(existData.rows.length, 'This entry is already stored');
            res.status(200).send({success: false, msg: "This entry is already stored", data: existData.rows.length});
        }
        else {
            text = `INSERT INTO users (firstname, lastname, city, company) VALUES ($1, $2, $3, $4)`
            values = [firstname, lastname, city, company];
            
            const result = await pool.query(text, values);
            console.log(result.rowCount, 'data added !!');
            res.status(200).send({success: true, msg: "Data added", data: result.rowCount});
        }

    } catch (error) {
        console.log(error, 'error here :::');
        res.status(500).send({success: false, msg: "Internal Server Error"});
    }
}


module.exports = {
    getUser,
    userById,
    uniqueCity,
    addData
}