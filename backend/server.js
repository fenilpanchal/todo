
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'todos'
};

app.get('/todos', async (req, res) => {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM todos');
    await conn.end();
    res.json(rows);
});

app.post('/todos', async (req, res) => {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('INSERT INTO todos (text) VALUES (?)', [req.body.text]);
    await conn.end();
    res.json({success: true});
});

app.delete('/todos/:id', async (req, res) => {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('DELETE FROM todos WHERE id = ?', [req.params.id]);
    await conn.end();
    res.json({success: true});
});

app.get('/health', (req,res)=>{
    res.status(200).json({status:"ok"});
});

//app.listen(5000, () => console.log('Backend running on port 5000'));
app.listen(process.env.PORT)

