'use client';

import { Users, PieChart, Target, CreditCard, Share2, ArrowRight, CheckCircle } from 'lucide-react';
import aboutImg from '../public/img/about.avif';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ListaBeneficios from './list-beneficios';
export default function AboutSection() {
    return (
        <>
            <section id='sobre' className="bg-white py-24 px-4 text-gray-800 h-screen border-b-2 border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                        {/* Imagem */}
                        <div className="w-full md:w-1/2">
                            <Image
                                src="/img/home2.svg"
                                alt="Finanças"

                                width={400}
                                height={300}
                            />
                        </div>

                        {/* Texto */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-4xl font-bold mb-6">Sobre o Sistema</h2>
                            <p className="text-lg text-gray-700 mb-4">
                                O sistema de finanças pessoais foi desenvolvido pensando nas famílias que desejam ter mais controle sobre seus gastos,
                                planejar juntos o futuro e alcançar metas financeiras com união e transparência.
                            </p>

                            <p className="text-lg text-gray-700 mb-4">
                                Com uma interface intuitiva e recursos colaborativos, nosso sistema permite que cada membro da família acompanhe e contribua para uma vida financeira mais saudável e organizada.
                            </p>
                            <Link href="/register" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                                Comece Agora
                                <ArrowRight className="ml-2" />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            <section id='porque' className="bg-green-900 py-4 px-4 text-white border-b-2 border-gray-200">
                <div className="max-w-6xl mx-auto mt-32 h-screen">
                    <div className="text-left mb-6">
                        <h2 className="text-5xl font-bold mb-4">
                            O que você vai encontrar:
                        </h2>

                    </div>

                    <div className="relative flex  w-full justify-between  items-center">
                        <ListaBeneficios></ListaBeneficios>
                        <Image
                            src="/img/card.svg"
                            alt="Finanças"
                            width={500}
                            height={300}
                        />

                    </div>
                    {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 align-items-center justify-center content-center">
                        <FeatureCard
                            icon={<Users className="w-10 h-10 text-green-600" />}
                            title="Visão Financeira Familiar"
                            className='bg-green-200 text-green-900'

                        />
                        <FeatureCard
                            icon={<PieChart className="w-10 h-10 text-green-500" />}
                            title="Orçamento Inteligente"
                            className='bg-green-200 text-green-900'

                        />
                        <FeatureCard
                            icon={<Target className="w-10 h-10 text-green-600" />}
                            title="Metas Compartilhadas"
                            className='bg-green-200 text-green-900'

                        />
                        <FeatureCard
                            icon={<CreditCard className="w-10 h-10 text-green-600" />}
                            title="Controle Total"
                            className='bg-green-200 text-green-900'
                        />
                        <FeatureCard
                            icon={<Share2 className="w-10 h-10 text-green-600" />}
                            title="Colaboração na Prática" className='bg-green-200 text-green-900'

                        />
                    </div> */}
                </div>
            </section >
        </>
    );
}

function FeatureCard({
    icon,
    className,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    className?: string;
    description?: string;
}) {
    return (
        <div className={`${className} p-6 rounded-2xl shadow hover:shadow-md transition `}>
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
