import { createProtectedRouter } from "../router/protected-router";
import { z } from "zod";

export const locationRouter = createProtectedRouter()
  .query("getLocations", {
    async resolve({ ctx }) {
      return await ctx.prisma.location.findMany()
    },
  })
  .query("findLocation", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.location.findUnique({ where: { id: input } })
    },
  })
  .mutation("createLocation", {
    input:
      z.object({
        name: z.string().min(1),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.location.create({
        data: {
          name: input.name,
          user: { connect: { id: ctx.session.user.id } }
        }
      })
    }
  })
  .mutation("updateLocation", {
    input:
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        userId: z.string().min(1),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.location.update({
        where: {
          id: input.id
        },
        data: {
          name: input.name,
          userId: input.userId,
        }
      })
    }
  })
  .mutation("deleteLocation", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.location.delete({ where: { id: input } })
    },
  })
