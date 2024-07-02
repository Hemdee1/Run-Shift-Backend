import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


const getCompanyStaff: RequestHandler = async (req, res) => {
    const { companyId } = req.params; // Assuming companyId is passed as a route parameter

    try {
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        const staff = await prisma.staff.findMany({
            where: {
                companyId: companyId,
            },
        });

        if (!staff || staff.length === 0) {
            return res.status(404).json({ message: 'No staff found for this company' });
        }

        res.status(200).json(staff);
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

const AddStaff: RequestHandler = async (req, res) => {
    let { firstName, lastName, companyEmail, companyPassword, newStaffEmail, role } = req.body;
    companyEmail = companyEmail?.toLowerCase();
    newStaffEmail = newStaffEmail?.toLowerCase();

    try {
        if (!(firstName && lastName && companyEmail && companyPassword && newStaffEmail && role)) {
            throw Error("All credentials must be included");
        }

        // Check if company exists
        const company = await prisma.company.findUnique({
            where: { email: companyEmail },
        });
        if (!company) {
            throw Error("Company does not exist");
        }

        // Verify the company password
        const isPasswordValid = await bcrypt.compare(companyPassword, company.password);
        if (!isPasswordValid) {
            throw Error("Invalid password");
        }

        // Check if the person adding the staff is a manager
        const manager = await prisma.staff.findFirst({
            where: {
                email: companyEmail,
                companyId: company.id,
                role: "manager",
            },
        });
        if (!manager) {
            throw Error("Only a manager can add new staff");
        }

        // Add the new staff to the company
        const hashedPassword = await bcrypt.hash(companyPassword, 10); // Assuming new staff will use the same password
        const staff = await prisma.staff.create({
            data: {
                firstName,
                lastName,
                email: newStaffEmail,
                company: {
                    connect: {
                        id: company.id,
                    },
                },
                password: hashedPassword,
                role,
            },
        });

        res.status(200).json(staff);
    } catch (error: any) {
        console.log(error);
        res.status(400).json(error.message);
    }
};


export { getCompanyStaff, AddStaff }