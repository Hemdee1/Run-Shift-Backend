import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
const prisma = new PrismaClient();


const getShifts: RequestHandler = async (req, res) => {

    try {
        const shift = await prisma.shift.findMany({
            include: {
                user: true
            }
        });
        res.status(200).json(shift);
    } catch (error: any) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

export { getShifts }