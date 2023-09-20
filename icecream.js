const express = require ('express');
const app = express();
const port =  process.env.PORT || 3000;
const pg = require("pg");
const client = new pg.Client('postgres://localhost/icecream_db');


app.get('/api/icecream', async(req, res, next) =>{
    try {
        const sql = `SELECT * FROM icecream;`;
        const response = await client.query(sql);
        res.send(response.rows); 
    } catch(error){
        next(error); 
    };
});

app.get('/api/icecream/:id', async(req,res,next)=>{
    try{
        const sql = `SELECT * FROM icecream WHERE id=$1;`;
        const response = await client.query(sql, [req.params.id]);
        
        if(!response.rows.length){
            next({
                name: 'MissinIDErorr',
                messeage: `icecream with id ${req.params.id} not found`,
            })
        }
        res.send(response.rows[0]);
    }catch(error){next(error)};
});

app.delete('/api/icecream/:id', async(req,res,next)=>{
    console.log('req.params.id', req.params.id);
    const sql = `DELETE FROM icecream WHERE id=$1;`;
    const response = await client.query(sql, [req.params.id]);
    console.log(response.rows);
    res.sendStatus(204);
});


app.use('/', (req, res, next)=>{
    console.log('i am in');
    res.send('hello');
});

app.use((error,req,res,next)=>{
    res.status(500);
    res.send(error);
});

const start = async () =>{
    client.connect();
    
    const sql =`
    DROP TABLE IF EXISTS icecream;
    CREATE TABLE icecream(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20)
        );
        INSERT INTO icecream(name) VALUES('vanilla');
        INSERT INTO icecream(name) VALUES('chocolate');
        INSERT INTO icecream(name) VALUES('strawberry');
        `;
        
        await client.query(sql);
        
        app.listen(port, ()=>{
            console.log(`the app is listening`);
        });
    };
    
    start();