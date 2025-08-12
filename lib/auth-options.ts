import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials)
          
          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              artist: true,
              customer: true,
              corporate: true,
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            artist: user.artist,
            customer: user.customer,
            corporate: user.corporate,
          } as any
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For OAuth providers, create/update user profile
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { customer: true, corporate: true, artist: true }
        })

        if (!existingUser) {
          // Create new customer account for Google OAuth users
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              role: 'CUSTOMER',
              customer: {
                create: {
                  firstName: user.name?.split(' ')[0] || '',
                  lastName: user.name?.split(' ').slice(1).join(' ') || '',
                  preferredLanguage: 'en'
                }
              }
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        // Fetch the full user data for OAuth
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: { customer: true, corporate: true, artist: true }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.artist = dbUser.artist
          token.customer = dbUser.customer
          token.corporate = dbUser.corporate
        }
      } else if (user) {
        // For credentials provider
        token.id = user.id
        token.role = user.role
        token.artist = user.artist
        token.customer = user.customer
        token.corporate = user.corporate
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.artist = token.artist as any
        session.user.customer = token.customer as any
        session.user.corporate = token.corporate as any
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut({ token }) {
      console.log(`User ${token.email} signed out`)
    },
  },
}