'use client'

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import Sidebar from "@/app/workspace/[workspaceId]/sidebar";
import { NuqsAdapter } from 'nuqs/adapters/next/app'


import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceSidebar from "@/app/workspace/[workspaceId]/workspace-sidebar";
import {usePanel} from "@/hooks/use-panel";
import {Loader} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {Thread} from "@/app/features/messages/components/thread";
import {Profile} from "@/app/features/members/components/profile";


interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}
const WorkSpaceIdLayout = ({children}: WorkspaceIdLayoutProps) => {
    const {parentMessageId, profileMemberId, onCloseMessage} = usePanel()
    const showPanel = !!parentMessageId || !!profileMemberId

    return (

        <div className='h-full'>

            <Toolbar />
            <div className='flex h-[calc(100vh-40px)]'>
                <Sidebar />
                <ResizablePanelGroup direction='horizontal' autoSaveId='ca-workspace-layout'>
                    <ResizablePanel defaultSize={20} minSize={11} className='bg-[#5e2c5f]'>
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel minSize={20}>

                        {children}

                    </ResizablePanel>
                    {showPanel && (
                        <>

                        <ResizableHandle withHandle/>

                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId ? (
                                    <Thread
                                    messageId={parentMessageId as Id<'messages'>}
                                    onClose={onCloseMessage}
                                    />
                                ) : profileMemberId ? (
                                    <Profile
                                    memberId={profileMemberId as Id<'members'>}
                                    onClose={onCloseMessage}
                                    />
                                ) : (
                                    <div className='flex items-center justify-center h-full'>
                                        <Loader className='size-5 animate-spin text-muted-foreground'/>
                                    </div>
                                )}

                            </ResizablePanel>

                        </>
                    )}
                </ResizablePanelGroup>

            </div>

        </div>

    );
};

export default WorkSpaceIdLayout;
