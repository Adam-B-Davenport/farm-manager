import { createProtectedRouter } from "../router/protected-router";
import { z } from "zod";

export const mowingRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.mowing.findMany({ include: { location: true }, orderBy: { date: 'desc' } })
    },
  })
  .query("getLocations", {
    async resolve({ ctx }) {
      return await ctx.prisma.mowingLocation.findMany()
    },
  })
  .query("findLocation", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowingLocation.findUnique({ where: { id: input } })
    },
  })
  .mutation("createLocation", {
    input:
      z.object({
        name: z.string().min(1),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowingLocation.create({
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
      return await ctx.prisma.mowingLocation.update({
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
  .query("getMowings", {
    async resolve({ ctx }) {
      return await ctx.prisma.mowing.findMany()
    },
  })
  .query("findMowing", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowing.findUnique({ where: { id: input } })
    },
  })
  .mutation("createMowing", {
    input:
      z.object({
        direction: z.string().min(1).max(2),
        locationId: z.string(),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowing.create({
        data: {
          direction: input.direction,
          location: { connect: { id: input.locationId } },
          user: { connect: { id: ctx.session.user.id } }
        }
      })
    }
  })
  .mutation("updateMowing", {
    input:
      z.object({
        id: z.string().min(1).cuid(),
        direction: z.string().min(1).max(2),
        locationId: z.string(),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowing.update({
        where: {
          id: input.id
        },
        data: {
          direction: input.direction,
          location: { connect: { id: input.locationId } },
          user: { connect: { id: ctx.session.user.id } }
        }
      })
    }
  })
  .mutation("deleteMowing", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.mowing.delete({ where: { id: input } })
    },
  })
