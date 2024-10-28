import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {useUpdateWorkSpace} from "@/app/features/workspaces/api/use-update-workspace";
import {useRemoveWorkSpace} from "@/app/features/workspaces/api/use-remove-workspace";
import {Input} from "@/components/ui/input";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useConfirm} from "@/hooks/use-confirm";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}
const PreferncesModal = ({
    open,
    setOpen,
    initialValue,
                         }: PreferencesModalProps) => {
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'This action is irreversible.'
    )
    const router = useRouter()
    const [value, setValue] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)

    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace} = useUpdateWorkSpace()
    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkSpace()

    const handleRemove = async () => {
        const ok = await confirm()
        if (!ok) return

        removeWorkspace({
            id: workspaceId
        }, {
            onSuccess: () => {
                toast.success('Workspace removed')
                router.replace('/')
            },
            onError: () => {
                toast.error('Failed to remove workspace') // Handle error
            },
        })
    }
    const handleEdit = (e: React.FormEvent<HTMLFormElement >) => {
    e.preventDefault()
        updateWorkspace({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success('Workspace updated')
                setEditOpen(false)
            },
            onError: () => {
               toast.error('Failed to update workspace') // Handle error
            },
        })
    }

    return (
        <>
            <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
              <DialogHeader className='p-4 border-b bg-white'>
                  <DialogTitle>
                      {value}
                  </DialogTitle>
              </DialogHeader>
              <div className='px-4 pb-4 flex flex-col gap-y-2'>
                  <Dialog open={editOpen} onOpenChange={setEditOpen}>
                      <DialogTrigger asChild>


                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                    <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold'>
                    Workspace name
                </p>
                        <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                            Edit
                        </p>
                    </div>
                    <p className='text-sm'>
                        {value}
                    </p>
                </div>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>
                                  Rename this workspace
                              </DialogTitle>
                          </DialogHeader>
                          <form className='space-y-4' onSubmit={handleEdit}>
                              <Input
                                  disabled={isUpdatingWorkspace}
                                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                                  type='text'
                                  placeholder='New workspace name e.g. "Work", "Personal, "Home""'
                                  value={value}
                                  onChange={(e) => setValue(e.target.value)}
                                  required
                                  autoFocus
                                  minLength={3}
                                  maxLength={80}
                              />
                              <DialogFooter>
                                  <DialogClose asChild>
                                      <Button
                                          variant='outline'
                                          disabled={isUpdatingWorkspace}
                                          className='flex items-center gap-x-2 px-5 py-4 bg-rose-600 rounded-md text-white'>
                                          Cancel
                                      </Button>
                                  </DialogClose>
                                  <Button disabled={isUpdatingWorkspace} variant='outline'>
                                      Save
                                  </Button>
                              </DialogFooter>

                          </form>
                      </DialogContent>
                  </Dialog>
                  <Button
                      disabled={isRemovingWorkspace}
                      onClick={handleRemove}
                      className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'>
                        <TrashIcon className='size-4'/>
                      <p className='text-sm font-semibold'>Delete workspace</p>
                  </Button>
              </div>
          </DialogContent>
      </Dialog>
        </>
    );
};

export default PreferncesModal;
