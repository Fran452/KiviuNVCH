/************* Metodos requeridos ****************/ 
require("dotenv").config()
const express = require("express");
const path = require("path");
const session = require("express-session");


//const userMiddlewares = require("./middlewares/userMiddlewares");
 
/*********** Rutas inportada ***************************/
const rutasMain = require("./routes/main");

/******** Diferentes funcionamientos ****************/
const PORT = process.env.PORT || 3030;
const app = express();
const publicPath = path.join(__dirname,"../client/build");
const cors = require("cors")

/*************** Middlewares *************************/
app.use(express.static(publicPath));
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended : false}));
app.set("view engine","ejs");
app.set("views","./src/views");
app.use(session({secret : "texto"}))

const userMiddlewares = require("./middlewares/userMiddlewares");


/***** Middlewares Propios *************************************/

app.use(userMiddlewares.userRegister);    


/***************** Rutas **********************/
app.use('/',rutasMain);

/**************** Inicio de apliacion ***************************/

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${process.env.link||`http://localhost:${PORT}`}`);
});

/**************** Error 404 ***************************/
/*app.use((req,res,next) => {
    res.status(404).render("not-found")
})*/