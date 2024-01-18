import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import { loginValidation, postCreateValidation, registerValidation } from './validations/validations.js';
import checkAuth from './utils/checkAuth.js';
import * as userController from './controllers/userController.js'
import * as postController from './controllers/postController.js'

mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log('DB ok'))
.catch((err) => console.log('DB not okay' , err))

const app = express();
app.use(express.json());

app.use(cors())
app.use('/uploads', express.static('uploads'))


const storage = multer.diskStorage({
    destination:(_, __, cb) => {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) =>{
        cb(null, file.originalname)
    }
})
const upload = multer({storage})


app.get('/' ,(req, res) => {
    res.send('Welcome to my new Node.js application')
})

app.post('/auth/login', loginValidation, userController.login)

app.post('/auth/register',registerValidation,userController.register )

app.get('/auth/profile',checkAuth, userController.profile)

app.get('/posts', postController.getAll)

app.get('/tags', postController.gatLastTags)

app.get('/posts/:id', postController.getOne)

app.post('/posts',checkAuth, postCreateValidation, postController.create)

app.delete('/posts/:id',checkAuth, postController.remove)

app.patch('/posts/:id',checkAuth, postController.update)

app.post('/upload', checkAuth, upload.single('image'), (req,res) =>{
    res.json({
        url:`/uploads/${req.file.originalname}`
    })
})

app.listen(process.env.PORT || '4444', (err) =>{
    if(err){
        return console.log(err)
    }
    console.log('Server is ok')
})