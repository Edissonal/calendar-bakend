const path = require( 'path' );
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');
//crear express
const  app = express();

// Base de datos
dbConnection();


//cors
app.use(cors())

//posteos body
app.use(express.json())


app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//directorio publico
app.use(express.static('public'));

app.use( '*', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'public/index.html' ) );
  } );

//escuchar peticiones
app.listen(process.env.PORT,()=>{
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})

