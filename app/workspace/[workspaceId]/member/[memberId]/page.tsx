'use client'
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useMemberId} from "@/hooks/use-member-id";
import {useCreateGetConversation} from "@/app/features/conversations/api/use-create-or-get-conversation";
import {useEffect, useState} from "react";
import {AlertTriangle, Loader} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {toast} from "sonner";
import {Conversation} from "@/app/workspace/[workspaceId]/member/[memberId]/conversation";

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId()

    const [conversationId, setConversationId] = useState<Id<'conversations'> | null>(null)
    
    const memberId = useMemberId()

    const { mutate, isPending} = useCreateGetConversation()

    useEffect(() => {
        mutate({
            workspaceId,
            memberId,
        }, {
            onSuccess(data) {
                setConversationId(data)
            },
           onError() {
                toast.error('Failed to create or get conversation')
           }
            }
        )
    }, [memberId, workspaceId, mutate]);

    if (isPending) {
        return <div className='h-full flex items-center justify-center'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>;
    }

    if (!conversationId) {
        return <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
            <AlertTriangle className='size-6  text-muted-foreground'/>
            <span className='text-sm text-muted-foreground'>
                Could not find conversation
            </span>
        </div>;
    }
    return <Conversation id={conversationId}/>

};

export default MemberIdPage;
