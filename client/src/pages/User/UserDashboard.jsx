import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCompass,
    faList,
    faBook,
    faHeart,
    faCog,
    faSearch,
    faPerson,
    faClock
} from '@fortawesome/free-solid-svg-icons';

function UserDashboard() {
    return (
        <div className='flex h-screen overflow-hidden'>
            <aside className='w-64 bg-gradient-to-br from-[#FFD23F] via-[#007EA7] to-[#00A8E8] shadow-lg p-6 flex-shrink-0 overflow-y-auto'>
                <h1 className='text-6x1 font-bold text-center font-["Poppins"] text-[#fff] mb-2.5'>
                    Ease Library
                </h1>
                <ul className='list-none mt-6 flex flex-col items-start gap-8'>
                    <li className='hover:bg-[#007EA7] px-5 py-2 w-50 border-0 rounded-md '>
                        <Link
                            to="/user/discover"
                            className='text-[#fff] text-[18px] font-["Poppins"] font-bold flex items-center gap-2 cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faCompass} /> Discover
                        </Link>
                    </li>
                    <li className='hover:bg-[#007EA7] px-5 py-2 w-50 border-0 rounded-md '>
                        <Link
                            to="/user/category"
                            className='text-[#fff] text-[18px] font-["Poppins"] font-bold flex items-center gap-2 cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faList} /> Category
                        </Link>
                    </li>
                    <li className='hover:bg-[#007EA7] px-5 py-2 w-50 border-0 rounded-md '>
                        <Link
                            to="/user/borrowedbooks"
                            className='text-[#fff] text-[18px] font-["Poppins"] font-bold flex items-center gap-2 cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faBook} /> My Library
                        </Link>
                    </li>
                    <li className='hover:bg-[#007EA7] px-5 py-2 w-50 border-0 rounded-md '>
                        <Link
                            to="/user/history"
                            className='text-[#fff] text-[18px] font-["Poppins"] font-bold flex items-center gap-2 cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faClock} /> History
                        </Link>
                    </li>
                    <li className='hover:bg-[#007EA7] px-5 py-2 w-50 border-0 rounded-md '>
                        <Link
                            to="/user/profile"
                            className='text-[#fff] text-[18px] font-["Poppins"] font-bold flex items-center gap-2 cursor-pointer'
                        >
                            <FontAwesomeIcon icon={faPerson} /> Profile
                        </Link>
                    </li>
                </ul>
            </aside>
            <main className='flex-1 overflow-y-auto'>
                <Outlet />
            </main>
        </div>
    )
}

export default UserDashboard;
