import { motion } from "framer-motion";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const testimonials = [
    {
        name: "Antonio Machado",
        feedback: "Esse sistema revolucionou a forma como organizo as finanças. Super intuitivo!",
        image: "/img/am.jpg", // Caminho da imagem de perfil
    },
    {
        name: "Elsandro Bento",
        feedback: "Nunca pensei que seria tão fácil acompanhar metas. Muito satisfeito!",
        image: "/img/eb.jpg",
    },
    {
        name: "Lúcio José",
        feedback: "Simples, rápido e visual. Agora sei exatamente onde estou gastando mais.",
        image: "/img/lj.jpg",
    },
];

export default function Depoimentos() {
    return (
        <section id="depoimentos" className="py-20   min-h-screen">
            <div className="container mx-auto px-4 text-center max-w-4xl">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-10"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    O Que Nossos Usuários Dizem
                </motion.h2>

                <Carousel
                    className="bg-white"
                    showArrows
                    showThumbs={true}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={6000}
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto"
                        >
                            <div className="flex justify-center h-30 w-30 mb-4">
                                <Image
                                    src={t.image}
                                    alt={t.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full border-2 border-green-500"
                                />
                            </div>
                            <p className="text-lg text-gray-800 italic mb-4">“{t.feedback}”</p>
                            <p className="text-sm font-semibold text-[#007C3D]">- {t.name}</p>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
