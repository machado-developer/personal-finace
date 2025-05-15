import { motion } from "framer-motion";
import {
    Users,
    Cloud,
    MonitorSmartphone,
    Headset,
    RefreshCcw,
    Handshake,
} from "lucide-react";

const motivos = [
    {
        text: "Interface intuitiva e acessível para todas as idades",
        Icon: Users,
    },
    {
        text: "Ambiente seguro com dados em nuvem",
        Icon: Cloud,
    },
    {
        text: "Acesso multiplataforma (PC, tablet e celular)",
        Icon: MonitorSmartphone,
    },
    {
        text: "Suporte técnico dedicado e sempre disponível",
        Icon: Headset,
    },
    {
        text: "Atualizações constantes com novas funcionalidades",
        Icon: RefreshCcw,
    },
    {
        text: "Comunidade ativa e suporte entre usuários",
        Icon: Handshake,
    },
];

export default function PorqueEscolher() {
    return (
        <section id="porque" className="py-20 bg-[#091426] text-gray-200 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.h2
                    className="text-4xl font-bold text-center mb-12"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Por Que Escolher o sistema <br />de Finanças pessoais?
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {motivos.map((item, i) => (
                        <motion.article
                            key={i}
                            className="bg-white shadow-md p-6 rounded-xl text-center text-gray-900"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                        >
                            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-700 rounded-full">
                                <item.Icon className="w-6 h-6" />
                            </div>
                            <p className="text-lg font-medium">{item.text}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
