import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
const prisma = new PrismaClient();


const getNotifications: RequestHandler = async (req, res) => {

    try {
        const notification = await prisma.notification.findMany();
        res.status(200).json(notification);
    } catch (error: any) {
        console.log(error);
        res.status(400).json(error.message);
    }
}

const addNotification: RequestHandler = async (req, res) => {
    console.log('hit');

    try {
        const newNotificationData = {
            ...req.body
        }

        const notification = await prisma.notification.create({
            data: newNotificationData
        });

        res.status(201).json(notification);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

export { getNotifications, addNotification }