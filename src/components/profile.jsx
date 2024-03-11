import { useState } from 'react'
import { FaCheck } from "react-icons/fa";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function profile({profpic, username, email}) {
    return (<>
        <div className="flex flex-row items-center gap-2">
                <div className="bg-neutral text-neutral-content rounded-full w-16 flex items-center justify-center h-16" tabIndex={0}>
                    <img src={profpic} className='rounded-full w-16 h-16' />
                </div>
        <div className='flex flex-col p-0 justify-start'>
        <span className='text-xl font-bold'>{username}</span>
        <span>{email}</span>
        </div>
        </div>
    </>);
}

export default profile;