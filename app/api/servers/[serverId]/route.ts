import { NextResponse } from "next/server";

import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params } : { params : { serverId: string }}
) {
    try {
        const profile = await CurrentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                imageUrl,
                name,
            }
        }) 
         
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { serverId: string } }
  ) {
    try {
      const profile = await CurrentProfile();
  
      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const server = await db.server.delete({
        where: {
          id: params.serverId,
          profileId: profile.id,
        }
      });
  
      return NextResponse.json(server);
    } catch (error) {
      console.log("[SERVER_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }