import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
const prisma = new PrismaClient();

const getShifts: RequestHandler = async (req, res) => {
    const companyId = req.params.companyId 

    console.log('route hit for get shift', companyId);
    

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

const addShift: RequestHandler = async (req, res) => {
    const { date, description, staffId, companyId } = req.body;

    try {
        const newShift = await prisma.shift.create({
            data: {
                date: date,
                description: description,
                staffId: staffId,
                companyId: companyId,
            },
            include: {
                staff: true,
                company: true,
            },
        })

        console.log(newShift);
        

        res.status(200).json(newShift);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ error: "Failed to add new shift." });
    }
};



export { getShifts, addShift }
