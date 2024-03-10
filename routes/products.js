
import { Router } from 'express';
import Product from '../models/Products.js';
import productMiddleware from '../middleware/products.js';
import userMiddleware from '../middleware/user.js';
const router = Router();


router.get('/', async (req, res) => {
    const products = await Product.find().lean()
    res.render('index', {
        title: 'Books | Home',
        products: products.reverse(),
        userId: req.userId ? req.userId.toString() : null

    })

})

router.get('/product', async (req, res) => {
    const user = req.userId ? req.userId.toString() : null
    const myProducts = await Product.find({ user }).populate('user').lean()
    res.render('product', {
        title: 'Books | product',
        isProduct: true,
        myProducts: myProducts,
    })
})

router.get('/add', productMiddleware, (req, res) => {

    res.render('add', {
        title: 'Books | add',
        isAdd: true,
        errorAddProducts: req.flash('errorAddProducts')
    })
})

router.get('/product/:id', async(req, res) => {

    try{
        const id = req.params.id
        const productt =await Product.findById(id).populate('user').lean()
    
        res.render('bolim', {
            bolim: productt
        })
    }
    catch(error){
        console.log(error)
    }
    
})

router.post('/add-products', userMiddleware, async (req, res) => {
    const { title, description, image, price } = req.body

    if (!title || !description || !image || !price) {
        req.flash('errorAddProducts', 'Hamma qatorni malumotini toliq kiriting..')
        res.redirect('/add')
        return
    }
    await Product.create({ ...req.body, user: req.userId })
    res.redirect('/')
})

export default router;