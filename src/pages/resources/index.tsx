"use client";
import React, { useState } from "react";
import Image from 'next/image';
import { AiOutlineHome } from "react-icons/ai"; // Importing the icon
import { BsFileBarGraph, BsBox2 } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5"; // Import the Logout icon
import { VscThreeBars } from "react-icons/vsc";

const Resources: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <div className="md:hidden flex justify-between items-center p-5 bg-black">
                <h1 className="text-4xl font-bungee">Resources</h1>
                <button onClick={toggleSidebar} className="text-white text-2xl">
                    <VscThreeBars />
                </button>
            </div>
            <div className={`md:hidden flex flex-col items-center justify-center bg-black`}>
                <aside className={`w-full p-5 bg-[rgba(10,12,14,1)] flex flex-col transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>
                    <div className="mb-7 text-center flex flex-col items-center">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/flower.png"
                                alt="Player"
                                width={150}
                                height={150}
                                className="rounded-full -ml-3"
                            />
                            <div className="text-left">
                                <p>Player 1</p>
                                <p className="text-[rgba(140,142,143,1)]">pimla@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-32">
                        <p className="text-[rgba(140,142,143,1)] text-2xl mb-3">ListItem</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <AiOutlineHome />
                            <span>Dashboard</span>
                        </button>
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <BsFileBarGraph />
                            <span>Leaderboard</span>
                        </button>
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <BsBox2 />
                            <span>Resources</span>
                        </button>
                    </nav>

                    <div className="text-left pt-5">
                        <button className="w-1/2 text-white py-2 text-center bg-transparent hover:bg-gray-700 flex items-center space-x-4 text-xl ml-10">
                            <IoLogOutOutline />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
                <div className={`flex-1 p-7 text-white flex flex-col items-center transition-all duration-300 ${sidebarOpen ? 'opacity-50' : 'opacity-100'}`}>
        <p className="text-2xl mb-0 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">YouTube</p>

        <div className="flex flex-col space-y-4  h-36 justify-center" style={{width:"15rem"}}>
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
            
        </div>

        <p className="text-2xl mb-0 mt-3 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">Articles</p>

        <div className="flex flex-col space-y-4 w-full h-36 justify-center">
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
            
        </div>

        <p className="text-2xl mb-0 mt-3 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">Github</p>

        <div className="flex flex-col space-y-4 w-full h-36 justify-center">
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
            <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
            
        </div>
    </div>
            </div>

            <div className="hidden md:flex flex-1">
                <aside className="w-64 p-5 bg-[rgba(10,12,14,1)] flex flex-col">
                    <div className="mb-7 text-center flex flex-col items-center">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/flower.png"
                                alt="Player"
                                width={150}
                                height={150}
                                className="rounded-full -ml-3"
                            />
                            <div className="text-left">
                                <p>Player 1</p>
                                <p className="text-[rgba(140,142,143,1)]">pimla@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-32">
                        <p className="text-[rgba(140,142,143,1)] text-2xl mb-3">ListItem</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <AiOutlineHome />
                            <span>Dashboard</span>
                        </button>
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <BsFileBarGraph />
                            <span>Leaderboard</span>
                        </button>
                        <button className="w-full text-white py-2 text-left bg-transparent hover:bg-gray-700 flex items-center space-x-3 text-xl ml-2">
                            <BsBox2 />
                            <span>Resources</span>
                        </button>
                    </nav>

                    <div className="text-left pt-5">
                        <button className="w-1/2 text-white py-2 text-center bg-transparent hover:bg-gray-700 flex items-center space-x-4 text-xl ml-10">
                            <IoLogOutOutline />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                <div className="flex-1 p-7 text-white flex flex-col items-center">
                    <h1 className="text-7xl mb-5 text-center font-bungee">Resources</h1>
                    <p className="text-4xl mb-0 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">YouTube</p>

                    {/* Container for the three divs */}
                    <div className="flex space-x-4 w-full h-36 justify-center">
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 3</div>
                    </div>

                    <p className="text-4xl mb-0 mt-3 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">Articles</p>
                    
                    <div className="flex space-x-4 w-full h-36 justify-center">
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 3</div>
                    </div>

                    <p className="text-4xl mb-0 mt-3 text-left w-full pl-0 font-cantora text-[rgba(140,142,143,1)]">Github</p>
                    
                    <div className="flex space-x-4 w-full h-36 justify-center">
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 1</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 2</div>
                        <div className="button-dashed-border bg-[rgba(10,12,14,1)] text-black text-center py-5 flex-1">Div 3</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
