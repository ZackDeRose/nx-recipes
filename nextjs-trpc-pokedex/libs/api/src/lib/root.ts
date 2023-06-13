import { router } from './trpc';
import { greetingRouter } from './routes/greeting';
import { pokemonRouter } from './routes/pokemon';

export const appRouter = router({
  greeting: greetingRouter,
  pokemon: pokemonRouter,
});

export type AppRouter = typeof appRouter;
