import { type } from "os";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const bidRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bid.findMany();
  }),

  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.bid.findFirst({ where: { id: input } });
  }),

  byUserId: protectedProcedure.query(({ ctx, input }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.bid.findMany({
      where: {
        userId: userId,
      },
      include: { listing: true },
    });
  }),

  get: publicProcedure
    .input(z.object({ bidId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.bid.findUnique({
        where: {
          id: input.bidId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        bidAmount: z.number().optional(),
        bidMessage: z.string().optional(),
        bidStatus: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bid.create({
        data: {
          ...input,
          bidDate: new Date(),
          userId: ctx.session.user.id,
        },
      });
    }),

  accept: protectedProcedure
    .input(z.object({ bidId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { bidId, userId } = input;
      

      const updatedBid = await ctx.prisma.bid.update({
        where: { id: bidId },
        data: { bidStatus: "accepted" },
        include: { listing: true },
      });

      if (!updatedBid) {
        throw new Error("Failed to update the bid status.");
      }

      const chat = await ctx.prisma.chat.create({
        data: {
          participants: {
            create: [{ userId: ctx.session.user.id }, { userId }],
          },
        },
      });

      if (!chat) {
        throw new Error("Failed to create a chat.");
      }

      type Job = {
        listingId: string;
        userId: string;
        bidId: string;
        jobStatus: string;
        jobAmount: number;
      }

      const job: Job = await ctx.prisma.job.create({
        data: {
          listingId: updatedBid.listingId,
          userId: userId,
          bidId: bidId,
          jobStatus: "pending",
          jobAmount: updatedBid.bidAmount,
        },
      });

      return {
        chatId: chat.id,
      };
    }),

  decline: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bid.update({
        where: { id: input },
        data: { bidStatus: "declined" },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.bid.delete({ where: { id: input } });
    }),
});

