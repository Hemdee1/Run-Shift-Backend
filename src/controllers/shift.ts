import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
const prisma = new PrismaClient();

const getShifts: RequestHandler = async (req, res) => {
    const companyId = req.params.companyId 

    console.log('route hit', companyId);
    

    try {
        const shifts = await prisma.shift.findMany({
            where: {
                companyId: companyId
            },
            include: {
                staff: true
            }
        });
        console.log(shifts);
        
        res.status(200).json(shifts);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ error: "Failed to fetch shifts for the company." });
    }
}

export { getShifts }
