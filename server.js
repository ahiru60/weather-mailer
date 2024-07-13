require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { default: mongoose } = require('mongoose');
const { execute } = require('./Utils/scheduler');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error',(error)=>{console.log(error)});
db.once('open',()=>{console.log('Connected to database')})

const userRoutes = require('./routes/users');

app.use(express.json());
app.use('/users', userRoutes);
//setInterval(execute, 3 * 60 * 60 * 1000);
execute();
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
