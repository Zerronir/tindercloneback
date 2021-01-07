import express from "express";
import Cors from "cors";
import mySql from "mysql";
import bcrypt from "bcrypt";

// App config
const app = express();
const port = process.env.PORT || 8001;

// MiddleWares
app.use(express.json());
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    });
app.use(Cors());

// DB Config
const db_name = "tinderclone";
const db_user = "root";
const db_pass = "";

const conn = mySql.createConnection({
    host: 'localhost',
    user: db_user,
    pass: db_pass,
    database: db_name
})


// Api Endpoints
app.get("/", (req, res) => res.status(200).send("Hello Clevers"));

app.get("/api/getUsers/:id", (req, res) => {

    conn.connect((err) => {

        let sql = "SELECT userId, userName, age, avatar, status, gender FROM users WHERE userId != ? AND gender IN ('Female', 'TransFemale') ORDER BY userId DESC";
        const userLogged = req.params.id;

        conn.query(sql, [userLogged], (err, result) => {
            if(err) res.status(500).send(err);

            res.status(200).send(result);
        })
    });

});

app.post("/api/doLogin", (req, res) => {

});

app.post("/api/addLike", (req, res) => {

    conn.connect((err) => {
        if(err) res.status(500).send(err);

        console.log(req.body);

        // Creamos la sentencia SQL y los valores que queremos insertar
        let sql = "INSERT INTO likes (fromUser, toUser) VALUES (?, ?)";
        const fromUser = req.body.fromUser;
        const toUser = req.body.toUser;

        // Insertamos los datos en la base de datos
        conn.query(sql, [fromUser, toUser], (err, result) => {
            if (err) res.status(500).send(err);
            next();

            res.status(201).send(result);
        });

    });

    next();

})

app.post("/api/newUser", (req, res) => {

    conn.connect(function(err) {
        if (err) {
            res.status(500).send(err);
        }

        console.log("connected");

        let sql = "INSERT INTO users (userName, email, password, phone, createdAt, lastLogin, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const userName = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone;
        const createdAt = new Date();
        const lastLogin = createdAt;
        const status = 'Offline';

        console.log(password);

        bcrypt.hash(password, 16, (err, hash) => {
            if(err) throw err;

            conn.query(sql, [userName, email, hash, phone, createdAt, lastLogin, status], (err, result) => {
                if(err) res.status(500).send(err);

                res.status(201).send(result);

            });
        });

        
    });

});


// Listener
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));


// Extra functions 

const generatePW = (pass) => {
    
} 