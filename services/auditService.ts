import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";


async function logAction(userId: string, action: string, details: string) {
    await prisma.log.create({
        data: {
            userId,
            action,
            details,
        },
    });
}

export default logAction;
//     })
//      },