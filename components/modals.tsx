'use client'

import CreateWorkspaceModal from "@/app/features/workspaces/components/create-workspaces-modal";
import {useEffect, useState} from "react";

const Modals = () => {

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null; // Modal is not yet mounted
    
    return (
        <>
            <CreateWorkspaceModal />
        </>
    );
};

export default Modals;
