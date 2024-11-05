import { RequestHandler } from "express";
import createHttpError from "http-errors"; 
import UserModel from "../models/user.model" ; 
import bcrypt from "bcrypt" ; 
import { store } from "../app" ; 
import mongoose from "mongoose" ; 

declare module "express-session" {
    interface SessionData {
        userId: mongoose.Types.ObjectId ; 
    }
}

export let makeshiftSessionUserId: mongoose.Types.ObjectId | undefined ; 
let makeshiftSessionExpiry: string ; 
let makeshiftSessionId: string ; 


export const fetchAuthenticatedUser: RequestHandler = async (req, res, next) => {
    
    try {

        if (Date.now() >= Date.parse(makeshiftSessionExpiry)) {
            makeshiftSessionUserId = undefined ; 
            throw createHttpError(401, "This user is not authenticated.")
        }

        if (!makeshiftSessionUserId) {
            throw createHttpError(401, "This user is not authenticated.") ; 
        }

        const user = await UserModel.findById(makeshiftSessionUserId).select("+email").exec() ; 

        res.status(200).json(user) ;
        
    } catch (error) {
        next(error) ; 
    }
}


interface SignUpRequestBody {
    username?: string,
    email?: string,
    password?: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpRequestBody, unknown> = async (req, res, next) => {
    
    const { username, email } = req.body ; 
    const rawPassword = req.body.password ; 

    try {
        if (!rawPassword || !email || !username) {
            throw createHttpError(400, "There are missing parameters. There should be a username, email, AND password")
        }

        const existentUsername = await UserModel.findOne({ username: username }).exec() ; 

        if (existentUsername) {
            throw createHttpError(409, "This username already exists.") ; 
        }

        const existentEmail = await UserModel.findOne({ email: email }).exec() ; 

        if (existentEmail) {
            throw createHttpError(409, "This email address already exists.") ;  
        }

        const hashedPassword = await bcrypt.hash(rawPassword, 10) ; 

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        }) ; 

        req.session.userId = newUser._id ; 
        req.session.save() ; 
        makeshiftSessionUserId = newUser._id
        makeshiftSessionId = req.sessionID ; 
        if (req.session.cookie.expires) {
            makeshiftSessionExpiry = req.session.cookie.expires.toISOString() ; 
        } else {
            makeshiftSessionExpiry = new Date(Date.now() + 60*60*1000*1.5).toISOString() ; 
        }
        
        res.status(201).json(newUser) ; 

    } catch (error) {
        next(error) ; 
    }
} 

interface LogInRequestBody {
    username?: string,
    email?: string,
    password?: string
}


export const logIn: RequestHandler<unknown, unknown, LogInRequestBody, unknown> = async (req, res, next) => {
    const { username, email } = req.body ; 
    const rawPassword = req.body.password ; 

    try {

        if (!username || !email || !rawPassword) {
            throw createHttpError(400, "There are missing parameters. There should be a username, email, AND password")
        }

        const user = await UserModel.findOne({ username: username }).select("+email +password").exec() ; 

        if (!user) {
            throw createHttpError(401, "Credentials are invalid") ; 
        }

        const doPasswordsMatch = await bcrypt.compare(rawPassword, user.password) ; 

        if (!doPasswordsMatch) {
            throw createHttpError(401, "Credentials are invalid") ;
        }

        req.session.userId = user._id ; 
        req.session.save() ; 

        makeshiftSessionUserId = user._id ; 
        makeshiftSessionId = req.sessionID ;

        if (req.session.cookie.expires) {
            makeshiftSessionExpiry = req.session.cookie.expires.toISOString() ; 
        } else {
            makeshiftSessionExpiry = new Date(Date.now() + 60*60*1000*1.5).toISOString() ; 
        }

        res.status(201).json({
            username: user.username,
            email: user.email,
            _id: user._id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            __v: user.__v
        }) ; 

    } catch (error) {
        next(error) ; 
    }
}


export const logOut: RequestHandler = async (req, res, next) => {

    store.destroy(makeshiftSessionId, (error) => {
        if (error) {
            next(error) ; 
        } else {
            res.clearCookie('connect.sid') ; 
            res.sendStatus(200) ; 
        }
    }) ; 

    makeshiftSessionUserId = undefined ; 
}


