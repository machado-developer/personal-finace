import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function GET(req: NextApiRequest, { params: { id: userId } }: { params: { id: string } }, res: NextApiResponse) {


    try {
        const data = await prisma.passwordResetToken.findUnique({
            where: {
                id: userId, // assuming userId is the id you want to search by
                token: 'your-token-here' // replace with the actual token value
            }, select: {
                id: true,
                userId: true
            },

        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}