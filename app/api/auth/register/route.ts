import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

const prisma = new PrismaClient()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.log("EROO",JSON.stringify(error));
    if (error instanceof z.ZodError) {
      
      return NextResponse.json(
        { message: "Invalid input data" },
        { status: 400 }
      )
    }
    
 
   
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}