'use client'

import CreateWorkspaceModal from "@/app/features/workspaces/components/create-workspaces-modal";
import {useEffect, useState} from "react";
import CreateChannelModal from "@/app/features/channels/components/create-channel-modal";

const Modals = () => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null; // Modal is not yet mounted
    
    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    );
};

export default Modals;
