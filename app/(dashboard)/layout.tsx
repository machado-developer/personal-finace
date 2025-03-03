'use client'
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { adminMenu, userMenu } from "../navmenu";

declare module 'next-auth' {
    interface Session {
        user: {
            name?: string | null
            email?: string | null
            image?: string | null
            role?: string | null
        }
    }
}



const Layout: React.FC<{ children: React.ReactNode; }> = ({ children, }) => {
    const { data: session } = useSession();
    const role = session?.user?.role || "user"; // Pega a role do usuário autenticado
    const username = session?.user?.name

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const menuItems = role === "admin" ? adminMenu : userMenu;

    return (
        <div className="flex h-screen  ">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 p-4 bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
            >
                <div className="flex justify-between items-center mb-4 md:hidden">
                    <h2 className="text-xl font-bold">{role === "admin" ? "Admin Panel" : "User Panel"}</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="mt-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.link} className="flex items-center p-2 rounded-lg hover:bg-green-200 hover:text-gray-800 transition">
                            {React.createElement(item.icon, { className: "w-5 h-5 mr-2" })}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="p-4 bg-white shadow-md flex items-center justify-between md:justify-between">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 md:hidden">
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* <h1 className="text-2xl font-semibold ml-4 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text text-2xl font-bold">Sistema De Finanças Pessoais</h1> */}
                    </div>
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition">
                            {/* <User className="w-6 h-6" /> */}
                            <span className="font-medium">olá, {username}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2">
                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200" onClick={() => alert('Logout')}>Logout</button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 mt-8 overflow-auto">{children}</main>

                {/* Footer */}
                <footer className="p-4 text-center bg-white shadow-md">
                    <p>&copy; {new Date().getFullYear()} {role === "admin" ? "Admin Panel" : "User Panel"}</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
