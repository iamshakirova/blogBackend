import Post from "../models/Post.js";
import {validationResult} from  'express-validator'

export const create = async(req,res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const doc = new Post({
            title:req.body.title,
            text:req.body.text,
            imageUrl:req.body.imageUrl,
            user:req.userId,
            tags: req.body.tags
        })
        const post = await doc.save()
        res.json(post)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'Couldnt create a post'})
    }
}

export const getAll = async(req,res) =>{

    try{
        const post = await Post.find().populate('user').exec()
        res.json(post)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'All posts are not found'})

    }
}

export const gatLastTags = async(req,res) =>{
    try{
        const posts = await Post.find()
        const tags = posts.map(post => post.tags).flat()
        res.json(tags)
    }catch(err){
        console.log(err)
        res.status(500).json({message:'All tags are not found'})
    }
}

export const getOne = async (req,res) => {

    try{
        const postId = req.params.id

        const updatePost = await Post.findByIdAndUpdate(
            {
                _id:postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                new:true
            }
        ).populate('user').exec();
        if(!updatePost){
            return res.status(404).json({message:'Title is not found'})
        }

        res.json(updatePost)

    }catch(err){
        console.log(err)
        res.status(500).json({message:'The post is not found'})
    }
}

export const remove = async (req,res) => {
    try{
        const postId = req.params.id

        const post = await Post.findByIdAndDelete(
            {
                _id:postId
            })

            if(!post){
                return res.status(404).json({message:'The post is not found'})
            }

            res.json({message:'Succesfully deleted'})

    }catch(err){
        console.log(err)
        res.status(500).json({message:'Not deleted'})
    }

}

export const update = async (req, res) =>{
    try{
        const postId = req.params.id

        await Post.updateOne(
            {
                _id:postId,
            },
            {
                title:req.body.title,
                text:req.body.text,
                imageUrl:req.body.imageUrl,
                user:req.userId,
                tags: req.body.tags
            }
        ).exec() //do and go forward
        res.json({message:'the post is updated'})
    }catch(err){
        console.log(err)
        res.status(500).json({message:'the post is not updated'})
    }
}