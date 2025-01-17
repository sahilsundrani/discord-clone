import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs"; 

import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";

export const NavigationSidebar = async () => {
    const profile = await CurrentProfile();

    if (!profile) return redirect("/");

    //this part can be optimized 
    const members = await db.member.findMany({
        where:{
            profileId: profile.id
        }
    })

    let servers = [];
    for (let i = 0; i < members.length; i++){
        const server = await db.server.findUnique({
            where: {
                id: members[i].serverId
            }
        })
        servers.push(server);
    }

    //till here

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3"
        >
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto items-center flex flex-col gap-y-4">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    );
};
