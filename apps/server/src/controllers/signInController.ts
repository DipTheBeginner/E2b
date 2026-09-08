import { prisma } from "@e2b-agent/database";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";





export default async function signInController(req: Request, res: Response) {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:"email and password are required"
      })
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message:"Invalid email or password"
      })
    }

    const passwordMatch = await bcrypt.compare(
          password,
          user.password,
        );

        if (!passwordMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid email or password",
          });
        }

        const token = jwt.sign(
             {
               id: user.id,
               email: user.email,
             },
             process.env.JWT_SECRET!,
             {
               expiresIn: "7d",
             },
           );

    return res.status(200).json({
      success: true,
      token
    });

    


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Signin Failed",
    });
  }
}
