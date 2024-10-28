'use client'


import {useChannelId} from "@/hooks/use-channel-id";
import {useGetChannel} from "@/app/features/channels/api/use-get-channel";
import {Loader, TriangleAlert} from "lucide-react";
import Header from "@/app/workspace/[workspaceId]/channel/[channelId]/header";
import ChatInput from "@/app/workspace/[workspaceId]/channel/[channelId]/chat-input";

const ChannelIdPage = () => {
    const channelId = useChannelId()
    const {data: channel, isLoading: chanelLoading} = useGetChannel({id: channelId})

if(chanelLoading) {
    return (
        <div className='flex-1 flex h-full items-center justify-center '>
            <Loader className='animate-spin size-5 text-muted-foreground' />
        </div>
    )
}

    if( !channel) {
        return (
            <div className='flex-1 flex h-full flex-col gap-y-2 items-center justify-center '>
                <TriangleAlert className=' size-6 text-muted-foreground' />
                <span className='text-sm text-muted-foreground'>
                    Channel not found
                </span>
            </div>
        )
    }


    return (
        <div className='flex flex-col h-full'>
            <Header title={channel.name}/>
            <div className='flex-1'/>
                <ChatInput placeholder={`Message # ${channel.name}`}/>

        </div>
    );
};

export default ChannelIdPage;
