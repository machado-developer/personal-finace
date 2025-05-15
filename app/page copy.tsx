"use client"

import HeaderNonAuth from '@/components/header-non-auth';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, DollarSign, PieChart, Shield } from 'lucide-react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

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
    <div className="flex flex-col min-h-screen">
      <HeaderNonAuth />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Gerencie Suas Finanças Pessoais com Facilidade
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Controle seus gastos, economize e alcance seus objetivos financeiros com nosso sistema intuitivo.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-yellow-400 text-green-900 hover:bg-yellow-500"
                asChild
              >
                <Link href="/register">Comece Agora</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-white/20 border-white"
                asChild
              >
                <Link className='text-gray-600' href="/learn-more">Saiba Mais</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Por que Escolher Nosso Sistema?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Segurança de Dados</h3>
              <p className="text-gray-600">
                Seus dados financeiros estão protegidos com segurança de nível bancário.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PieChart className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análises Detalhadas</h3>
              <p className="text-gray-600">
                Obtenha insights detalhados sobre seus hábitos de consumo e economize mais.
              </p>
            </motion.div>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <DollarSign className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Objetivos Financeiros</h3>
              <p className="text-gray-600">
                Defina e acompanhe seus objetivos financeiros para alcançar suas metas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Clientes Satisfeitos
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Junte-se a mais de 10.000 clientes satisfeitos que já estão transformando suas vidas financeiras.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                  <p className="text-lg text-gray-800 mb-4">&quot;{testimonial.feedback} &ldquo;</p>
                  <p className="text-sm font-semibold text-gray-600">- {testimonial.name}</p>
                </div>
              ))}
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pronto para Assumir o Controle de Suas Finanças?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-3"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Junte-se a milhares de pessoas que já estão transformando suas vidas financeiras.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
              <Link href="/register">
                Comece Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-gray-600 mt-4">Carregando...</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
