'use client'

import React from 'react';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useCurrentUser} from "@/app/features/auth/api/use-current-uset";
import {Loader, LogOut} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

const UserButton = () => {
    const {data, isLoading} = useCurrentUser()
    const {signOut} = useAuthActions()

    const handleSignOut = () => {
        signOut()
           .then(() => location.href = '/auth')
           .catch(console.error)
    }

    if(isLoading) {
        return <Loader className='size-4 animate-spin text-muted-foreground'/>
    }
    if(!data) {
        return null
    }
    const {image, name} = data

    const avatarFallback = name!.charAt(0).toUpperCase()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
<Avatar className='rounded-md size-10 hover:opacity-75 transition '>
<AvatarImage alt={name} src={image} className='rounded-md'/>
    <AvatarFallback className='rounded-md bg-sky-500 text-white'>
        {avatarFallback}
    </AvatarFallback>
</Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' side='right' className='w-60'>
<DropdownMenuItem onClick={handleSignOut} className='h-10'>
<LogOut className='size-4 mr-2'/>
    Log out
</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
