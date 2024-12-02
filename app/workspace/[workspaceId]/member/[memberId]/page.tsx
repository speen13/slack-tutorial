'use client'
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useMemberId} from "@/hooks/use-member-id";

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()
    return (
        <div>
            {JSON.stringify({memberId, workspaceId})}
        </div>
    );
};

export default MemberIdPage;
