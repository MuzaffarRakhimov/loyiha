import {Router} from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import { generateJwtToken } from '../services/token.js';
import authMiddleware from '../middleware/auth.js';
const router = Router();

router.get('/register',authMiddleware,(req,res)=>{
  
    res.render('register',{
        title:'Books | register',
        isRegister:true,
         registerError:req.flash('registerError'),
    })
 })

 router.get('/login',authMiddleware,(req,res)=>{
     
    res.render('login',{
       title:'Books | login',
       isLogin:true ,
       loginError:req.flash('loginError'),
    }) 
 })

 router.get('/logout',(req,res)=>{
   res.clearCookie('token')
   res.redirect('/')
 })
// Login Post ___________________________________________________

 router.post('/login', async (req,res)=>{
   const {email ,password } = req.body

   if(!email || !password){
      req.flash('loginError','Malumotni toliq kiriting..')
      res.redirect('/login')
      return
   }

    const exzedUser = await User.findOne({email})
    if(!exzedUser){
      req.flash('loginError','Emailni kiritishda  xatolik..')
      res.redirect('/login')
      return
    } 

    const isPasEquel = await bcrypt.compare(password , exzedUser.password)
    if(!isPasEquel){
      req.flash('loginError','parolni kiritishda xatolik..')
      res.redirect('/login')
      return
    } 
     
    const token = generateJwtToken(exzedUser._id)
    res.cookie('token',token,{httpOnly:true , secure:true})
    res.redirect('/')
 })

 // Register Post___________________________________________________

 router.post("/register", async ( req , res )=>{

   const {password,email,firstname,lastname} = req.body

   if(!password || !email || !firstname || !lastname){
      req.flash('registerError','Hamma qatorni malumotini toliq kiriting..')
      res.redirect('/register')
      return
   }

   const tekshiruv = await User.findOne({email})

   if(tekshiruv){
      req.flash('registerError','Bu email allaqachon royhatdan otgan..')
      res.redirect('/register')
      return
   }

   const hashPasword = await bcrypt.hash(password,10)
        const userData = {
        firstname : firstname,
        lastname : lastname,
        email: email,
        password: hashPasword,
    };

    const user = await User.create(userData)
    const token = generateJwtToken(user._id)
    res.cookie("token",token,{httpOnly:true , secure:true})

    res.redirect('/');
 })

 //______________________________________________________

export default router


   
