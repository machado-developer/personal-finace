import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

function HeaderNonAuth() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleScroll = () => {
                if (window.scrollY > 50) {
                    setScrolled(true);
                } else {
                    setScrolled(false);
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    return (
        <header className={`fixed w-full top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow' : 'bg-gradient-to-r from-green-400 to-[#166D37]'}    py-2`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <Link href="/" className={` text-2xl font-bold text-gray-100 ${scrolled && "text-green-400"}`}>DiFP</Link>
                </div>
                <nav className="nav">
                    <ul className="flex space-x-5 justify-center w-full">

                        <li>

                            <Button
                                size="lg"
                                className="bg-transparent border border-white text-white hover:bg-yellow-500"
                                asChild
                            >
                                <Link href="/login">Entrar</Link>
                            </Button>

                        </li>
                        <li>

                            <Button
                                size="lg"
                                className="bg-yellow-400 text-green-900 hover:bg-yellow-500"
                                asChild
                            >
                                <Link href="/register">Comece Agora</Link>
                            </Button>

                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default HeaderNonAuth;
