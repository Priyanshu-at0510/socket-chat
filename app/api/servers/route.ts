import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemeberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4} from 'uuid'
export const runtime = 'experimental-edge'


export async function POST(req:Request){
    try{
        const {name ,imageUrl} = await req.json();
        const profile =await currentProfile()

        if(!profile){
            return new NextResponse("unauthorized",{status :401})
        }

        const server = await db.server.create({
            data:{
                profileId:profile.id,
                name,
                imageUrl,
                invitationCode:uuidv4(),
                channels:{
                   create:[
                    {name:"general",profileId:profile.id}
                   ] 
                },
                members:{
                   create:[
                    {profileId:profile.id, role:MemeberRole.ADMIN}
                   ] 
                }

            }
        });

        return NextResponse.json(server)

    }catch(error){
        console.log("[SERVERS_POST]",error)
        return new NextResponse("Internal Error", {status:500})
    }
}