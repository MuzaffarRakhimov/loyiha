import express from 'express';
import mongoose from 'mongoose';
import flesh from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser'; 

import { engine, create } from 'express-handlebars';
import varMiddleware from './middleware/var.js'
import userMiddleware from './middleware/user.js';
import hbsHelpers from './utils/index.js';
import 'dotenv/config';

// routs
import Product from './routes/products.js'; 
import Auth from './routes/auth.js'


   
const app = express();  

const hbs = create({ 
    defaultLayout: 'main',
    extname: 'hbs',
    helpers : hbsHelpers,
})
  
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

// Midellverlar
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'Books', resave: false, saveUninitialized: false }))
app.use(flesh())
app.use(varMiddleware)
app.use(userMiddleware)


app.use(Product);
app.use(Auth);


 

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URI) 
    .then(() => {
        console.log('mongodbga ulanish hosil qilindi..')
    })
    .catch((error) => {
        console.error('mongodbga ulanishda xatolik yuzberdi..', error)
    })


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`${port}porti eshitishni boshladik..`)
})
 


