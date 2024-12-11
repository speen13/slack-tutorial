import {Doc, Id} from "@/convex/_generated/dataModel";
import dynamic from "next/dynamic";
import {format, isToday, isYesterday} from "date-fns";
import {Hint} from "@/components/hint";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Thumbnail} from "@/components/thumbnail";
import {Toolbar} from "@/components/toolbar";
import {useUpdateMessage} from "@/app/features/messages/api/use-update-message";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {useRemoveMessage} from "@/app/features/messages/api/use-remove-message";
import {useConfirm} from "@/hooks/use-confirm";
import {useToggleReaction} from "@/app/features/reactions/api/use-toogle-reaction";
import {Reactions} from "@/components/reactions";
import {usePanel} from "@/hooks/use-panel";
import {ThreadBar} from "@/components/thread-bar";


const Editor = dynamic(() => import('@/components/editor'), {ssr: false})
const Renderer = dynamic(() => import('@/components/renderer'), {ssr: false})
interface MessageProps {
    id: Id<'messages'>
    memberId: Id<'members'>
    authorImage?: string
    authorName: string
    isAuthor: boolean
    reactions: Array<Omit<Doc<'reactions'>, 'memberId'>> & {
        count: number
        memberIds: Id<'members'>[]
    }
    body: Doc<'messages'>['body']
    image: string | null | undefined
    createdAt: Doc<'messages'>['_creationTime']
    updatedAt: Doc<'messages'>['updatedAt']
    isEditing: boolean
    isCompact?: boolean
    setEditingId: (id: Id<'messages'> | null) => void
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    threadName?: string
    threadTimestamp?: number
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? 'Today': isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
}

export const Message = ({
    id,
    memberId,
    authorImage,
    authorName = 'Member',
    isAuthor,
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName,
    isCompact,

}: MessageProps) => {
    const {parentMessageId, onOpenMessage, onOpenProfile, onCloseMessage} = usePanel()
    const [ConfirmDialog, confirm] = useConfirm(
        'Delete message',
        'Are you sure you want to delete this message? This cannot be undone.'
    )
    const {mutate: updateMessage, isPending: isUpdatingMessage} = useUpdateMessage()
    const {mutate: removeMessage, isPending: isRemovingMessage} = useRemoveMessage()
    const {mutate: toggleReactions, isPending: isTogglingReaction} = useToggleReaction()

    const isPending = isUpdatingMessage || isTogglingReaction

    const handleReactions = (value: string) => {
        toggleReactions({messageId: id, value}, {
            onError: () => {
                toast.error('Failed to toggle reaction')
            },
        })
    }

    const handleRemove = async  () => {
        const ok = await  confirm()
        if (!ok) return

        removeMessage({id}, {
            onSuccess: () => {
                toast.success('Message deleted')

                if (parentMessageId === id) {
                    onCloseMessage()
                }
            },
            onError: () => {
                toast.error('Failed to delete message')
            }
        })
    }
    const handleUpdate = ({body}: {body: string}) => {
        updateMessage({id, body}, {
            onSuccess: () => {
                toast.success('Message updated')
                setEditingId(null)
            },
            onError: () => {
                toast.error('Failed to update message')
            }
        })
    }

    if(isCompact) {
    return (
        <>
        <div className={cn(
            'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
            "bg-rose500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}>
            <div className='flex items-start gap-2'>
                <Hint label={formatFullTime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
                {format(new Date(createdAt), 'hh:mm')}
            </button>
                </Hint>
                {isEditing ? (
                    <div className='w-full h-full'>
                        <Editor
                            onSubmit={handleUpdate}
                            disabled={isPending}
                            defaultValue={JSON.parse(body)}
                            onCancel={() => setEditingId(null)}
                            variant='update'
                        />
                    </div>
                ) : (
                <div className='flex flex-col w-full'>
                    <Renderer value={body}/>
                    <Thumbnail url={image}/>
                    {updatedAt? (
                        <span className='text-xs text-muted-foreground'>(edited)</span>
                    ): null}
                    <Reactions data={reactions} onChange={handleReactions}/>
                    <ThreadBar
                    count={threadCount}
                    image={threadImage}
                    name={threadName}
                    timestamp={threadTimestamp}
                    onClick={() => onOpenMessage(id)}
                    />
                </div>
                )}
            </div>
            {!isEditing && (
                <Toolbar
                    isAuthor={isAuthor}
                    isPending={isPending}
                    handleEdit={() => setEditingId(id)}
                    handleThread={() => onOpenMessage(id)}
                    handleDelete={handleRemove}
                    hideThreadButton={hideThreadButton}
                    handleReaction={handleReactions}
                />
            )}

        </div>
            </>
    )
}
    const avatarFallback = authorName.charAt(0).toUpperCase()

    return (
        <>
            <ConfirmDialog />
        <div className={cn(
            'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
            "bg-rose500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}>
            <div className='flex items-start gap-2'>
            <button onClick={() => onOpenProfile(memberId)}>
                <Avatar>
                    <AvatarImage  src={authorImage}/>
                    <AvatarFallback>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>

            </button>
                {isEditing ? (
                    <div className='w-full h-full'>
                       <Editor
                       onSubmit={handleUpdate}
                       disabled={isPending}
                       defaultValue={JSON.parse(body)}
                       onCancel={() => setEditingId(null)}
                       variant='update'
                       />
                    </div>
                ) : (
            <div className='flex flex-col w-full overflow-hidden'>
                <div className='text-sm'>
                    <button onClick={() => onOpenProfile(memberId)} className='font-bold text-primary hover:underline'>
                        {authorName}
                    </button>
                    <span>&nbsp;&nbsp;</span>
                    <Hint label={formatFullTime(new Date(createdAt))}>
                    <button className='text-xs text-muted-foreground hover:underline'>
                        {format(new Date(createdAt), 'h:mm a')}
                    </button>
                    </Hint>
                </div>
            <Renderer value={body}/>
                <Thumbnail url={image}/>
                {updatedAt ? (
                    <span className='text-xs text-muted-foreground'>(edited)</span>
                ): null}

                <Reactions data={reactions} onChange={handleReactions}/>
                <ThreadBar
                    count={threadCount}
                    image={threadImage}
                    name={threadName}
                    timestamp={threadTimestamp}
                    onClick={() => onOpenMessage(id)}
                />

            </div>
                )}
        </div>
            {!isEditing && (
                <Toolbar
                isAuthor={isAuthor}
                isPending={isPending}
                handleEdit={() => setEditingId(id)}
                handleThread={() => onOpenMessage(id)}
                handleDelete={handleRemove}
                hideThreadButton={hideThreadButton}
                handleReaction={handleReactions}
                />
            )}
        </div>
        </>
    )
}