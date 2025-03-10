// Script para criar um usuário admin no banco de dados
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("divaldo@admin", 10);

    const user = await prisma.user.upsert({
        where: { email: "geral@difp.com" },
        update: {}, // Se já existir, não atualiza nada
        create: {
            name: "Admin",
            email: "geral@difp.com",
            password: hashedPassword, // Apenas se armazenar hash da senha
            role: "ADMIN", // Define o papel como ADMIN
        },
    });

    console.log("Usuário criado:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
