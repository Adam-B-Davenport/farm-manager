// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { mowingRouter } from "../mowing/mowing-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("mowing.", mowingRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
