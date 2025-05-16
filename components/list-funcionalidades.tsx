import { motion } from "framer-motion";
import {
    Home,
    User,
    PieChart,
    Target,
    FileText,
} from "lucide-react";

const funcionalidades = [
    {
        text: "Visão Geral Familiar",
        Icon: Home,
        description: "Um painel único com todas as movimentações: entradas, saídas, metas e saldos.",
    },
    // {
    //     text: "Perfis Personalizados",
    //     Icon: User,
    //     description: "Cada membro da família pode ter um perfil com permissões específicas — ideal para casais, filhos e responsáveis financeiros.",
    // },
    {
        text: "Planejamento de Orçamento por Categoria",
        Icon: PieChart,
        description: "Definam orçamentos mensais para alimentação, moradia, transporte, lazer e mais, com alertas para evitar extrapolar.",
    },
    {
        text: "Metas Compartilhadas",
        Icon: Target,
        description: "Crie objetivos financeiros como “viagem em família” ou “compra de carro” e acompanhem juntos o progresso.",
    },
    {
        text: "Relatórios Detalhados",
        Icon: FileText,
        description: "Acompanhe todas as movimentações com relatórios claros e detalhados para uma visão completa das finanças.",
    },
];

export default function ListFuncionalidades() {
    return (
        <section  className="py-20 bg-white min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.h2
                id="funcionalidades"
                    className="text-3xl md:text-4xl font-bold text-center mb-12"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Funcionalidades Principais
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {funcionalidades.map((item, index) => (
                        <motion.article
                            key={index}
                            className="bg-white shadow-md p-6 rounded-xl text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-green-100 text-green-700 rounded-full">
                                <item.Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.text}</h3>
                            <p className="text-lg text-gray-700 font-medium">{item.description}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
