import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {useCreateChannelModal} from "@/app/features/channels/store/use-create-channel-modal";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useCreateChannel} from "@/app/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useRouter} from "next/navigation";
import {toast} from "sonner";



const CreateChannelModal = () => {
    const router = useRouter()
    const [open, setOpen] = useCreateChannelModal()
    const [name, setName] = useState('')

    const {mutate, isPending} = useCreateChannel()
    const workspaceId = useWorkspaceId()

    const handleClose = () => {
        setName('')
        setOpen(false)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
        setName(value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({ name, workspaceId }, {
            onSuccess: (id) => {
                toast.success('Channel created')
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                handleClose()

            },
            onError: () => {
                toast.error('Failed to create channel')
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
           <DialogContent>
               <DialogHeader>
                   <DialogTitle>
                       Add Channel
                   </DialogTitle>
               </DialogHeader>
               <form onSubmit={handleSubmit} className='space-y-4'>
                   <Input
                   disabled={isPending}
                   value={name}
                   onChange={handleChange}
                   required
                   autoFocus
                   minLength={3}
                   maxLength={80}
                   placeholder='e.g. plan-budget'
                   />
                   <div className='flex justify-end'>
                    <Button disabled={isPending}>
                        Create
                    </Button>
                   </div>

               </form>
           </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;
