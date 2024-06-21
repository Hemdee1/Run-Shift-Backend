import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
const prisma = new PrismaClient();


const getStaff: RequestHandler = async (req, res) => {

    try {
        const staff = await prisma.staff.findMany();
        res.status(200).json(staff);
    } catch (error: any) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

export { getStaff }