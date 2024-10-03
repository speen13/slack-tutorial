'use client'

import UserButton from "@/app/features/auth/components/user-button";
import {useGetWorkspaces} from "@/app/features/workspaces/api/use-get-workspaces.";
import {useEffect, useMemo} from "react";
import {useCreateWorkspaceModal} from "@/app/features/workspaces/store/use-create-workspaces-modal";
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter()
const [open, setOpen] = useCreateWorkspaceModal()

const {data, isLoading} = useGetWorkspaces()

    const workspaceId = useMemo(() => data?.[0]?._id, [data])

    useEffect(() => {
        if(isLoading) return ;
        if(workspaceId) {
            // location.href = `/workspace/${workspaceId}`
            router.replace(`/workspace/${workspaceId}`)
        }
        else if(!open) {
            setOpen(true) // Open modal when there are no workspaces
        }
    }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div>

        <UserButton />

    </div>
  );
}
