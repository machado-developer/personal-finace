'use client'
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { adminMenu, userMenu } from "../navmenu";
import Loading from "../loading";

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

const Layout: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <Loading />; // Exibe um spinner enquanto carrega
    }

    const role = session?.user?.role;
    const username = session?.user?.name;
    const menuItems = role === "ADMIN" ? adminMenu : userMenu;

    return (
        <div className="flex h-screen">
            <Sidebar 
                role={role} 
                menuItems={menuItems} 
            />
            <div className="flex flex-col flex-1">
                <Header username={username} />
                <main className="flex-1 p-6 mt-8 overflow-auto">{children}</main>
                <Footer role={role} />
            </div>
        </div>
    );
};

const LoadingScreen = () => (
    <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
    </div>
);

const Sidebar: React.FC<{ role: string | null | undefined, menuItems: any[] }> = ({ role, menuItems }) => (
    <aside className="w-64 p-4 bg-gradient-to-r from-green-600 to-[#166D37] text-white shadow-lg">
        <h2 className="text-xl font-bold">{role === "ADMIN" ? "Admin Panel" : "User Panel"}</h2>
        <nav className="mt-4 space-y-2">
            {menuItems.map((item) => (
                <Link key={item.name} href={item.link} className="flex items-center p-2 rounded-lg hover:bg-green-200 hover:text-gray-800 transition">
                    {React.createElement(item.icon, { className: "w-5 h-5 mr-2" })}
                    {item.name}
                </Link>
            ))}
        </nav>
    </aside>
);

const Header: React.FC<{ username: string | null | undefined }> = ({ username }) => (
    <header className="p-4 bg-white shadow-md flex items-center justify-between">
        <span className="font-medium">Olá, {username?.split(" ")[0]}</span>
        <button className="p-2 rounded-lg hover:bg-gray-200 transition" onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>
    </header>
);

const Footer: React.FC<{ role: string | null | undefined }> = ({ role }) => (
    <footer className="p-4 text-center bg-white shadow-md">
        <p>&copy; {new Date().getFullYear()} {role === "ADMIN" ? "Admin Panel" : "User Panel"}</p>
    </footer>
);

export default Layout;
