// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { mowingRouter } from "../mowing/mowing-router";
import { locationRouter } from "../location/router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("mowing.", mowingRouter)
  .merge("location.", locationRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
