import prismaClient from "../../prisma";

interface HaircutRequest{
    user_id: string
    haircut_id: string
    name: string
    price: number
    status: boolean | string
}

class UpdateHaircutService{
    async execute({user_id, haircut_id, name, price, status = true}: HaircutRequest){

        //buscar a subscritpion da pessoa logada

        const user = await prismaClient.user.findFirst({
            where:{
                id: user_id
            },
            include:{
                subscription: true,
            }
        })

        if(user?.subscription?.status !== 'active'){
            throw new Error("Não autorizado!")
        }

        const haircut = await prismaClient.haircut.update({
            where:{
                id: haircut_id
            },
            data: {
                name: name,
                price: price,
                status: status === true ? true : false,
            }
        })

        return haircut
    }
}


export{UpdateHaircutService}