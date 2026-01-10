import React from 'react'

const Login = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center px-4 py-8'>
            <div className='flex flex-col gap-5 w-full sm:w-110'>
                <h2 className='text-2xl md:text-3xl text-(--Text) [font-family:var(--Prosto-family)]'>Sign up to <span className='text-(--Primary) text-4xl md:text-5xl cursor-pointer [font-family:var(--Ceviche-family)] select-none'>Talksy</span></h2>
                <form className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-(--Text)/80'>Name</p>
                        <input className='px-3 py-3 outline-none text-(--Text) text-md rounded-lg border-2 border-(--Border)' type="text" required placeholder='Enter your name' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-(--Text)/80'>Email</p>
                        <input className='px-3 py-3 outline-none text-(--Text) text-md rounded-lg border-2 border-(--Border)' type="email" required placeholder='Enter your email' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <p className='text-(--Text)/80'>Password</p>
                        <input className='px-3 py-3 outline-none text-(--Text) text-md rounded-lg border-2 border-(--Border)' type="password" required placeholder='Enter your password' />
                    </div>
                    <button className='bg-(--Primary) text-md font-medium text-(--Text) cursor-pointer rounded-lg px-3 py-3 mt-1'>Create an Account</button>
                    <div className='flex gap-2'>
                        <span className='h-px w-full bg-(--Text)/40 mt-3'></span>
                        <p className='text-(--Text)/80'>Or</p>
                        <span className='h-px w-full bg-(--Text)/40 mt-3'></span>
                    </div>
                    <button className='flex items-center justify-center gap-2 bg-(--Text) text-md font-medium text-(--Background) cursor-pointer rounded-lg px-3 py-3 mt-1'><img src="/assets/google.png" alt="" /> Sign up with Google</button>
                </form>
                <div className='w-full flex items-center justify-center'>
                    <p className='text-(--Text) font-light'>Already have an account? <span className='underline font-medium text-(--Primary) cursor-pointer'>Log in</span></p>
                </div>
            </div>
        </div>
  )
}

export default Login