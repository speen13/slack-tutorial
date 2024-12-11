import {Id} from "@/convex/_generated/dataModel";
import {useGetMember} from "@/app/features/members/api/use-get-member";
import {Button} from "@/components/ui/button";
import {AlertTriangle, Loader, MailIcon, XIcon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

interface ProfileProps {
    memberId: Id<'members'>
    onClose: () => void
}

export const Profile = ({memberId, onClose}: ProfileProps) => {
    const {data: member, isLoading: isLoadingMember} = useGetMember({id: memberId})

    if(isLoadingMember) {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p className='text-lg font-bold'>Thread</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className='size-5 stroke-[1.5]'/>
                    </Button>
                </div>
                <div className='flex items-center justify-center h-full'>
                    <Loader className='size-5 animate-spin text-muted-foreground'/>
                </div>
            </div>

        )
    }

    if (!member) {
        return (
            <div className='h-full flex flex-col'>
                <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                    <p className='text-lg font-bold'>Profile</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className='size-5 stroke-[1.5]'/>
                    </Button>
                </div>
                <div className='flex flex-col gap-y-2 items-center justify-center h-full'>
                    <AlertTriangle className='size-5  text-muted-foreground'/>
                    <p className='text-sm text-muted-foreground'>Profile not found</p>
                </div>
            </div>
        )
    }
const avatarFallback = member.user.name?.[0] ?? 'M'
    return (
        <div className='h-full flex flex-col'>
            <div className='flex h-[49px] justify-between items-center px-4 border-b'>
                <p className='text-lg font-bold'>Profile</p>
                <Button onClick={onClose} size='iconSm' variant='ghost'>
                    <XIcon className='size-5 stroke-[1.5]'/>
                </Button>
            </div>
            <div className='flex flex-col  items-center justify-center p-4'>
                <Avatar className='max-w-[256px] max-h-[256px] size-full'>
                    <AvatarImage src={member.user.image} size='sm' />
                    <AvatarFallback className='aspect-square text-6xl'>
                    {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className='flex flex-col p-4'>
                <p className='text-xl font-bold'>
                    {member.user.name}
                </p>
            </div>
            <Separator />
            <div className='flex flex-col p-4'>
            <p className='text-sm font-bold mb-4'>
                Contact information
            </p>
                <div className='flex items-center gap-2'>
                <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
                    <MailIcon className='size-4'/>
                </div>
                    <div className='flex flex-col'>
                        <p className='text-[13px] font-semibold text-muted-foreground'>Email Address</p>
                        <Link className='text-sm hover:underline text-[#1264a3]' href={`mailto:${member.user.email}`}>
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}