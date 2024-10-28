import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";
import {Button} from "@/components/ui/button";



export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null)

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve})
    })

    const handleClose = () => {
        setPromise(null)
    }

    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }

    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }

    const ConfirmDialog = () => {
        return (
            <Dialog open={promise!== null}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                    <DialogFooter className='pt-2'>

                            <Button variant='outline' onClick={handleCancel}>
                                Cancel
                            </Button>

                        <Button  onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

return [ConfirmDialog, confirm]
};


