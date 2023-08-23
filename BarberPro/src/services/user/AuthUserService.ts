import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import {sign} from 'jsonwebtoken'

interface AuthUserRequest{
    email: string
    password: string
}

class AuthUserService{
    async execute({email, password}: AuthUserRequest){

        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            },
            include:{
                subscription: true,
            }
        })

        if(!user){
            throw new Error("Email/password incorrect")
        }

        //verifica se a senha está correta

        const passwordMatch = await compare(password, user?.password)
 
        if(!passwordMatch){
            throw new Error("Email/password incorrect")
        }

        //Gerar um token JWT

        const token = sign(
            {
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            endereco: user?.endereco,
            token: token,
            subscriptions: user.subscription?{
                id: user?.subscription?.id,
                status: user?.subscription?.status
            }:null
        }
    }
}



export {AuthUserService}