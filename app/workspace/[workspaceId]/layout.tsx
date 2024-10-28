'use client'

import Toolbar from "@/app/workspace/[workspaceId]/toolbar";
import Sidebar from "@/app/workspace/[workspaceId]/sidebar";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceSidebar from "@/app/workspace/[workspaceId]/workspace-sidebar";


interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}
const WorkSpaceIdLayout = ({children}: WorkspaceIdLayoutProps) => {
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

                </ResizablePanelGroup>

            </div>

        </div>
    );
};

export default WorkSpaceIdLayout;
