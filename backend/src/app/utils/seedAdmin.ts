import bcrypt from "bcrypt";
import { envVars } from "../config/env";
import prisma from "./prisma";
import { Role } from "../../generated/prisma/enums";

export const seedAdmin = async () => {
    try {
        const existing = await prisma.user.findUnique({
            where: { email: envVars.ADMIN_EMAIL },
        });

        if (existing) {
            console.log("Admin already exists, skipping seed.");
            return;
        }

        console.log("Creating admin...");

        const passwordHash = await bcrypt.hash(
            envVars.ADMIN_PASSWORD,
            Number(envVars.BCRYPT_SALT_ROUND)
        );

        const admin = await prisma.user.create({
            data: {
                name: "Admin Mentor",
                email: envVars.ADMIN_EMAIL,
                passwordHash,
                role: Role.MENTOR,
            },
            select: { id: true, name: true, email: true, role: true },
        });

        console.log("Admin created successfully:", admin);
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};
