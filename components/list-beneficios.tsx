import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const beneficios = [
    "Acompanhar todos os gastos da família em um só painel",
    "Definir orçamentos por categoria ou por membro",
    "Criar metas familiares e acompanhar o progresso",
    "Controlar contas, cartões, despesas fixas e extras com clareza",
    "Compartilhar responsabilidades financeiras com praticidade"
];

export default function ListaBeneficios() {
    return (
        <ul>
            {beneficios.map((texto, index) => (
                <motion.li
                    key={index}
                    className="flex items-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                    <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-full mr-4">
                        <CheckCircle className="w-6 h-6 text-green-900" />
                    </div>
                    <p className="text-lg font-light text-green-200">
                        {texto}
                    </p>
                </motion.li>
            ))}
        </ul>
    );
}
