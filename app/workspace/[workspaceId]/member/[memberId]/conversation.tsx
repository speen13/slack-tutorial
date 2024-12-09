import {Id} from "@/convex/_generated/dataModel";
import {useMemberId} from "@/hooks/use-member-id";
import {useGetMember} from "@/app/features/members/api/use-get-member";
import {useGetMessages} from "@/app/features/messages/api/use-get-messages";
import {Loader} from "lucide-react";
import Header from "@/app/workspace/[workspaceId]/member/[memberId]/header";
import ChatInput from "@/app/workspace/[workspaceId]/member/[memberId]/chat-input";
import {MessageList} from "@/components/message-list";

interface ConversationProps {
    id: Id<'conversations'>
}

export const Conversation = ({id} :ConversationProps) => {
    const memberId = useMemberId()
    const {data: member, isLoading: memberLoading} = useGetMember({id: memberId})
    const {results, status, loadMore} = useGetMessages({
        conversationId: id,
    })

    if (memberLoading || status === 'LoadingFirstPage') {
        return <div className='h-full flex items-center justify-center'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>;
    }

    return (
        <div className='flex flex-col h-full'>
            <Header
            memberName={member?.user.name}
            memberImage={member?.user.image}
            onClick={() => {}}
            />
            <MessageList
                memberImage={member?.user.image}
                memberName={member?.user.name}
                variant='conversation'
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === 'LoadingMore'}
                canLoadMore={status === 'CanLoadMore'} />
            <ChatInput
                placeholder={`Message ${member?.user.name}`}
                conversationId={id} />
        </div>
    )
}