import {Button} from "@/components/ui/button";
import {FaChevronDown} from "react-icons/fa";

import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {TrashIcon} from "lucide-react";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {useUpdateChannel} from "@/app/features/channels/api/use-update-channel";
import {useChannelId} from "@/hooks/use-channel-id";
import {toast} from "sonner";
import {useRemoveChannel} from "@/app/features/channels/api/use-remove-channel";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/app/features/members/api/use-current-member";



interface HeaderProps {
    title: string
}
const Header = ({title}: HeaderProps) => {

    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [value, setValue] = useState(title)
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const {mutate: updateChannel, isPending: isUpdatingChannel} = useUpdateChannel()
    const {mutate: removeChannel, isPending: isRemoveChannel} = useRemoveChannel()
    const {data: member} = useCurrentMember({workspaceId})
    const[ConfirmDialog, confirm] = useConfirm(
        'Delete this channel?',
        'You are about to delete this channel. This action is irreversible'
    )

    const handleEditOpen = (value: boolean) => {
        if(member?.role !== 'admin') return

setEditOpen(value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
        setValue(value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault()

        updateChannel({id: channelId, name: value}, {
            onSuccess: () => {
                toast.success('Channel updated')
                setEditOpen(false)
            },
            onError: () => {
                toast.error('Failed to update channel')
            }
        })
    }

    const handleDelete = async () => {
    const ok = await confirm()
        if(!ok) return

        removeChannel({id: channelId}, {
            onSuccess: () => {
                toast.success('Channel deleted')
                router.push(`/workspace/${workspaceId}`)
            },
            onError: () => {
                toast.error('Failed to delete channel')
            }
        })
    }

    return (
        <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
          <Button
          variant='ghost'
          className='text-lg font-semibold px-2 overflow-hidden w-auto'
          size='sm'
          >
              <span className='truncate'># {title}</span>
              <FaChevronDown className='size-2.5 ml-2' />
          </Button>
                </DialogTrigger>
                <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                    <DialogTitle>
                        # {title}
                    </DialogTitle>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                            <DialogTrigger asChild>
                       <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                        <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold'>
                            Channel name
                        </p>
                            {member?.role === 'admin' && (
                            <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                                Edit
                            </p>
                            )}
                        </div>
                           <p className='text-sm'># {title}</p>
                       </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this channel
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                <Input
                                value={value}
                                disabled={isUpdatingChannel}
                                onChange={handleChange}
                                required
                                autoFocus
                                minLength={3}
                                maxLength={80}
                                placeholder='e.g. plan-budget'
                                />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                            variant='outline'
                                            disabled={isUpdatingChannel}
                                            >
                                                Cancel
                                            </Button>

                                        </DialogClose>
                                        <Button disabled={isUpdatingChannel}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
            </Dialog>
                        {member?.role === 'admin' && (
                        <Button onClick={handleDelete} disabled={isRemoveChannel} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600'>
                            <TrashIcon className='size-4'/>
                            <p className='text-sm font-semibold'>Delete channel</p>
                        </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Header;