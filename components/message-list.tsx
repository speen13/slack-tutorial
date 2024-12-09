import {GetMessagesReturnType} from "@/app/features/messages/api/use-get-messages";
import {differenceInMinutes, format, isToday} from "date-fns";
import {Message} from "@/components/message";
import {ChannelHero} from "@/components/channel-hero";
import {useState} from "react";
import {Id} from "@/convex/_generated/dataModel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/app/features/members/api/use-current-member";
import {Loader} from "lucide-react";
import {ConversationHero} from "@/components/conversation-hero";

const TIME_THRESHOLD = 5
interface MessageListProps {
    memberName?: string
    memberImage?: string
    channelName: string
    channelCreationTime: number
    variant: "channel" | "thread" | "conversation"
    data: GetMessagesReturnType | undefined
    loadMore: () => void
    isLoadingMore: boolean
    canLoadMore: boolean
}

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if(isToday(date)) {
        return 'Today'
    }
    if(isToday(date)) {
        return 'Yesterday'
    }
    return format(date, 'EEEE, MMMM, d')
}
export const MessageList = ({
    memberName,
    memberImage,
    channelName,
    channelCreationTime,
    variant = 'channel',
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
                            }: MessageListProps) => {
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useCurrentMember({ workspaceId })

    const [editingId, setEditingId] = useState<Id<'messages'> | null>(null )

    const groupMessages = data?.reduce(
        (groups, message) => {
        const date = new Date(message._creationTime)
        const dateKey = format(date, 'yyyy-MM-dd')
            if(!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].unshift(message)
            return groups
        },
        {} as Record<string, typeof data>
    )

    return (
    <div className='flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar'>
        {Object.entries(groupMessages || {}).map(([dateKey, messages]) => (
            <div key={dateKey}>
                <div className='text-center my-2 relative'>
                <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300'/>
                    <span className='relative inline-block bg-white px-4 py-1 rounded-full tetx-xs border border-gray-300 shadow-sm'>
                        {formatDateLabel(dateKey)}
                    </span>
                </div>
                {messages.map((message, index) => {
                    const prevMessage = messages[index - 1]
                    const isCompact =
                        prevMessage &&
                        prevMessage.user?._id === message.user?._id &&
                        differenceInMinutes(
                            new Date(message._creationTime),
                            new Date(prevMessage._creationTime),
                        ) <= TIME_THRESHOLD
                    return (
                        <Message
                        key={message._id}
                        id={message._id}
                        memberId={message.memberId}
                        authorImage={message.user.image}
                        authorName={message.user.name}
                        isAuthor={message.memberId === currentMember?._id}
                        reactions={message.reactions}
                        body={message.body}
                        image={message.image}
                        updateAt={message.updateAt}
                        createdAt={message._creationTime}
                        isEditing={editingId === message._id}
                        setEditingId={setEditingId}
                        isCompact={isCompact}
                        hideThreadButton={variant === 'thread'}
                        threadCount={message.threadCount}
                        threadImage={message.threadImage}
                        threadName={message.threadTimestamp}
                        />
                    )
                })}
            </div>
        ))}

        <div
            className='h-1'
            ref={(el) => {
                if (el) {
                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry.isIntersecting && canLoadMore) {
                                loadMore();
                            }
                        },
                        { threshold: 1.0 }
                    );
                    observer.observe(el);
                    return () => observer.disconnect();
                }
            }}
        />
        {isLoadingMore && (
            <div className='text-center my-2 relative'>
                <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300'/>
                <span
                    className='relative inline-block bg-white px-4 py-1 rounded-full tetx-xs border border-gray-300 shadow-sm'>
                        <Loader className='size-4 animate-spin'/>
                    </span>
            </div>
        )}
        {variant === 'channel' && channelName && channelCreationTime && (
            <ChannelHero
                name={channelName}
                creationTime={channelCreationTime}
            />
        )}
        {variant === 'conversation'  && (
            <ConversationHero
                name={memberName}
                image={memberImage}
            />
        )}
    </div>
    )
}