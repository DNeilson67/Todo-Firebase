import React from "react";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { BsChevronExpand } from "react-icons/bs"
import { Link } from "react-router-dom";
import { auth } from "../firebase";

import Profile from "./profile";

function profileDropDown({profpic, username, email, settings, logout}) {
    return (<>
        <div className='dropdown dropdown-bottom w-fit'>
            <div className="flex flex-row items-center gap-2" role="button" tabIndex={0}>
                <Profile username = {username} email = {email} profpic={profpic}/>
                <BsChevronExpand className="text-2xl"/>
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-4 shadow bg-base-100 rounded-box w-60 text-lg">
                <Link to = "/account"><li onClick={settings}><a><IoSettings />Settings</a></li></Link>
                <li onClick={logout}><a><IoLogOut className='text-red-400'/>Logout</a></li>
            </ul>
        </div>
    </>);
}

export default profileDropDown;