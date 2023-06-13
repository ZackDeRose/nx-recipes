import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const pokemonRouter = router({
  getPokemon: publicProcedure
    .input(z.coerce.number().min(1).max(151))
    .query(async (opts) => {
      const id = opts.input;
      const pokemon = await fetchPokemon(id);
      return pokemon;
    }),
  getAll: publicProcedure.query(fetchAllPokemon),
});

async function fetchAllPokemon(): Promise<Pokemon[]> {
  const arr = [];
  for (let i = 1; i <= 151; i++) {
    arr.push(fetchPokemon(i));
  }
  const results = await Promise.all(arr);
  assertPokemonArray(results);
  return results;
}

async function fetchPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();
  assertPokemon(data);
  return data;
}

const pokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({
        name: z.enum([
          'hp',
          'attack',
          'defense',
          'special-attack',
          'special-defense',
          'speed',
        ]),
      }),
    })
  ),
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({
        name: z.enum([
          'normal',
          'fighting',
          'flying',
          'poison',
          'ground',
          'rock',
          'bug',
          'ghost',
          'steel',
          'fire',
          'water',
          'grass',
          'electric',
          'psychic',
          'ice',
          'dragon',
          'dark',
          'fairy',
          'steel',
        ]),
      }),
    })
  ),
  sprites: z.object({
    front_default: z.string().url(),
  }),
});

export type Pokemon = z.infer<typeof pokemonSchema>;

function assertPokemon(x: unknown): asserts x is Pokemon {
  const parseResult = pokemonSchema.safeParse(x);
  if (!parseResult.success) {
    console.error((parseResult as any).error);
    throw new Error('Not a pokemon');
  }
}

function assertPokemonArray(x: unknown): asserts x is Pokemon[] {
  if (typeof x !== 'object' || !Array.isArray(x)) {
    throw new Error('Not an array of pokemon');
  }
  for (const pokemon of x) {
    const parseResult = pokemonSchema.safeParse(pokemon);
    if (!parseResult.success) {
      console.error((parseResult as any).error);
      throw new Error('Not a pokemon');
    }
  }
}
