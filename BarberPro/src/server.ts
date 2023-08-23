import express, {Request, Response, NextFunction} from "express";
import 'express-async-errors'
import cors from 'cors'
import {router} from './routes'
import  BodyParser from "body-parser";

const app = express()
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(router)
app.use((err: Error, req: Request, res:Response, next: NextFunction)=>{
    if(err instanceof Error){
        return res.status(400).json({
            error: err.message
        })
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error.'
    })
})
app.listen(3333, ()=> console.log("Servidor Online"))