import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

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
        <header className={`fixed w-full top-0 z-50  bg-transparent' ${scrolled && "bg-white"} align-items-center justify-content-center  py-6 bg-opacity-100`}>
            <div className="container mx-auto flex justify-between  justify-center items-center">
                <div className="logo mr-6">
                    <Link href="/" className={` text-4xl font-bold text-gray-100`}>
                        <Image src={"/img/logo.png"} alt="Logo" width={100} height={100} className="inline-block mr-2" />
                    </Link>
                </div>
                <nav className={`nav mr-4 w-full flex justify-between  items-center flex-end ${scrolled ? 'text-black' : 'text-white'} `}>

                    <ul className={`flex space-x-5 justify-center w-full ${scrolled && "text-black"} text-sm md:text-base`}>
                        <li>

                            <Link href="/">Início</Link>

                        </li>
                        <li>

                            <Link href="#sobre">Sobre</Link>

                        </li>
                        <li>

                            <Link href="#porque">Beneficios</Link>

                        </li>

                        <li>

                            <Link href="#funcionalidades">Funcionalidades</Link>

                        </li>
                        

                    </ul>
                    <ul className="flex space-x-5 justify-center w-full">

                        <li>

                            <Button
                                size="lg"
                                className={` ${scrolled ? "bg-dark-base" : "bg-transparent"} border border-white text-white hover:bg-yellow-500`}
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
