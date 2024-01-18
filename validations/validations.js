import { body } from 'express-validator'
export const registerValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password should contains min 5 symbols').isLength({min:5}),
    body('fullName' , 'Set name').isLength({min:3}),
    body('avatarUrl', 'Incorrect url').optional().isURL()
]

export const loginValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password', 'Password should contains min 5 symbols').isLength({min:5})
]

export const postCreateValidation = [
    body('title', 'Enter a title').isLength({min:3}).isString(),
    body('text', 'Enter a text').isLength({min:15}).isString(),
    body('tags', 'Incorrect format').optional(),
    body('imageUrl', 'Incorrect url').optional().isString()
]