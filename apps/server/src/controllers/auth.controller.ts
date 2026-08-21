import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { prisma } from "@e2b-agent/database";




export default async function signupController(req: Request, res: Response) {

    try {

     
        const { email, password, username } = req.body;

        console.log("1")

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        console.log("2")

        if (existingUser) {
            return (
                res.status(409).json(
                    {
                        message: "User already exisits"
                    }
                )
            )
        }

        console.log("3")

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username
            }
        })

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            "secret"
        )

        return res.status(201).json({
            success: true,
            token
        })


    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            error: "Signup Failed"
        })

    }
}