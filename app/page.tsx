"use client";

import AboutSection from '@/components/about-section';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import bg from '../public/img/bg.jpg';
import Image from 'next/image';
import ListFuncionalidades from '@/components/list-funcionalidades';
import PorqueEscolher from '@/components/PortqueEscolher';
import Depoimentos from '@/components/depoimentos';
import HeaderNonAuth from '@/components/header-non-auth';
export default function Home() {
  const testimonials = [
    {
      name: "João Silva",
      feedback: "Este sistema mudou minha vida financeira para melhor!",
    },
    {
      name: "Maria Oliveira",
      feedback: "Agora consigo economizar e planejar meus gastos com facilidade.",
    },
    {
      name: "Carlos Pereira",
      feedback: "Recomendo a todos que querem ter controle sobre suas finanças.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">

      <HeaderNonAuth />
      {/* Hero Section */}
      <section className="relative bg-[#091426]  overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          {/* <Image
            src={bg}
            alt="Fundo finanças"
            className="w-full h-full object-cover opacity-10"
          /> */}
          <div className="absolute inset-0 bg-[#091426]/80" />
        </div>
        <div className=" relative container mx-auto px-4 py-20 text-center max-w-6xl">
          <motion.h1
            className="text-4xl md:text-6xl text-white font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Controle Total das Suas Finanças Pessoais
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Gerencie, planeje e conquiste seus objetivos com uma plataforma moderna e eficiente.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="bg-[#007C3D] hover:bg-[#006432] text-white px-8 py-4 rounded-full font-semibold text-lg" asChild>
              <Link href="/register">Comece Agora</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-[#007C3D] text-[#007C3D] hover:bg-[#007C3D]/10 px-8 py-4 rounded-full font-semibold text-lg" asChild>
              <Link href="/learn-more">Saiba Mais</Link>
            </Button>
          </motion.div>
        </div>
        <div className="absolute bottom-0 right-0 w-100  mb-4   pointer-events-none">
          <Image
            src="/img/home.svg"
            alt="Finanças"

            width={500}
            height={300}
          />
        </div>
        {/* <div className="absolute top-[10px] left-0 w-100  mb-4 opacity-70 pointer-events-none">
          <Image
            src="/img/home2.svg"
            alt="Finanças"
            
            width={400}
            height={300}
          />
        </div> */}
      </section>
      <>
        <AboutSection></AboutSection>
      </>
      {/* Benefícios e Vantagens */}
      <ListFuncionalidades></ListFuncionalidades>

      {/* Benefícios e Vantagens */}
      <PorqueEscolher></PorqueEscolher>

      <Depoimentos></Depoimentos>
      {/* Chamada para ação */}
      <section id="acao" className="py-20 bg-[#091426] text-white text-left  relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Comece Agora e Transforme as suas Finanças!

          </motion.h2>
          <motion.p
            className="text-lg md:text-xl mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Cadastre-se gratuitamente e tenha controle total da sua vida financeira.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="bg-green-800 text-white hover:bg-green-900 px-8 py-4 rounded-full font-semibold text-lg" asChild>
              <Link href="/register">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          <div className="absolute bottom-0 right-0   mb-4   pointer-events-none">
            <Image
              src="/img/account.svg"
              alt="Finanças"
              width={500}
              height={300}
            />
          </div>
        </div>

      </section>
    </div>
  );
}