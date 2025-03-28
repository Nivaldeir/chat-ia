"use server"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const createUser = async (data: { email: string; name: string; password: string }) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userExists) {
    return {
      error: true,
      message: "Usuário já existente"
    }
  };

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
    },
  });

  return {
    error: false,
    data: newUser
  };
};
