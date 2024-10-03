


import {useCreateWorkspaceModal} from "@/app/features/workspaces/store/use-create-workspaces-modal";
import {Dialog,  DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateWorkSpace} from "@/app/features/workspaces/api/use-create-workspace";
import {useRouter} from "next/navigation";
import  {useState} from "react";
import {toast} from "sonner";

const CreateWorkspaceModal  = () => {
    const [open, setOpen] = useCreateWorkspaceModal()
    const [name, setName] = useState('')
const router = useRouter()
    const {mutate, isPending} = useCreateWorkSpace()

    const handleClose = () => {
        setOpen(false)
        setName('')
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
        mutate({name}, {
            onSuccess(id) {
                toast.success('Workspace created')
                router.push(`/workspace/${id}`)
                handleClose()
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add a workspace
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                <Input
                    value={name}
                    disabled={isPending}
                    onChange={(e) => {setName(e.target.value)}}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="Workspace Name e.g. 'Work', 'Personal', 'Home'"
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

export default CreateWorkspaceModal ;
