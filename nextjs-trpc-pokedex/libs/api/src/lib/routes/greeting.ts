import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const greetingRouter = router({
  getGreeting: publicProcedure.query(async () => {
    return { message: 'Welcome to Pokedex!' };
  }),
});
