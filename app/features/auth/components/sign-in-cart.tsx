'use client'

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import {SignInFlow} from "@/app/features/auth/types";
import {useState} from "react";
import {TriangleAlert} from "lucide-react";

interface SignInCartProps {
    setState: (state: SignInFlow) => void
}
export const SignInCard = ({setState}: SignInCartProps) => {
    const {signIn} = useAuthActions()

    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
        setPending(true)
        signIn('password', {email, password, flow: 'signIn'})
            .catch(() => {
            setError('Invalid email or password')
            })
            .finally(() => {
                setPending(false)
                location.href = '/'
            })
    }

    const onProviderSignIn = (value: 'github' | 'google') => {
        setPending(true)
        signIn(value)
            .finally(() => {
                setPending(false)

            })
    }

    return (
        <Card className='w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Login to continue
                </CardTitle>

            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            {!!error && (
                <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
<TriangleAlert className='size-4'/>
                    <p>{error}</p>
                </div>
            )}
            <CardContent className='space-y-5 px-0 pb-0'>
<form onSubmit={onPasswordSignIn} className='space-y-2.5'>
    <Input
    disabled={false}
    value={email}
    placeholder='Email '
    onChange={(e) => {setEmail(e.target.value)}}
    type='email'
    required
    />
    <Input
        disabled={false}
        value={password}
        placeholder='Password'
        onChange={(e) => {setPassword(e.target.value)}}
        type='password'
        required
    />
    <Button size='lg' disabled={pending} type='submit' className='w-full'>
        Continue
    </Button>
</form>
                <Separator />
                <div className='flex flex-col gap-y-2.5'>
<Button size='lg' disabled={pending} onClick={() => onProviderSignIn('google')} variant='outline' className='w-full relative'>
    <FcGoogle className='size-5 absolute top-3 left-2.5'/>
    Continue with Google
</Button>
                    <Button size='lg' disabled={pending} onClick={() => onProviderSignIn('github')} variant='outline' className='w-full relative'>
                        <FaGithub className='size-5 absolute top-3 left-2.5'/>
                        Continue with GitHub
                    </Button>
                </div>
                <p className='text-xs text-muted-foreground'>
Don&apos;t have an account? <span onClick={() => setState('signUp')} className='text-sky-700 hover:underline cursor-pointer'>Sign Up</span>
                </p>
            </CardContent>
        </Card>
    )
}