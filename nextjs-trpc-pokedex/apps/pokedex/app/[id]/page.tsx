import styles from './page.module.css';
import { api } from '../api-util';
import Image from 'next/image';
import type { Pokemon } from '@acme/api';
import Link from 'next/link';

export async function generateStaticParams() {
  const ids = [];
  for (let i = 1; i <= 151; i++) {
    ids.push(`${i}`);
  }

  return ids.map((id) => ({ id }));
}

export default async function PokemonPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const targetId = +id;
  const queries: [
    Promise<Pokemon | undefined>,
    Promise<Pokemon>,
    Promise<Pokemon | undefined>
  ] = [
    targetId > 1
      ? api.pokemon.getPokemon.query(targetId - 1)
      : Promise.resolve(undefined),
    api.pokemon.getPokemon.query(targetId),
    targetId < 151
      ? api.pokemon.getPokemon.query(targetId + 1)
      : Promise.resolve(undefined),
  ];
  const [prev, current, next] = await Promise.all(queries);
  return (
    <div className={styles.page}>
      <h1>{current.name}</h1>
      <Image
        src={current.sprites.front_default}
        alt={current.name}
        width={100}
        height={100}
      />
      <h2>Type: {current.types.map((x) => x.type.name).join(' | ')}</h2>
      <h2>Stats</h2>
      {current.stats.map((x) => (
        <h3 key={x.stat.name}>
          {x.stat.name}: {x.base_stat}
        </h3>
      ))}
      <div className={styles.links}>
        {prev && (
          <Link href={`/${prev.id}`} className={styles.link}>
            <h2>prev: {prev.name}</h2>
            <Image
              src={prev.sprites.front_default}
              alt={prev.name}
              width={50}
              height={50}
            />
          </Link>
        )}
        {next && (
          <Link href={`/${next.id}`} className={styles.link}>
            <h2>next: {next.name}</h2>
            <Image
              src={next.sprites.front_default}
              alt={next.name}
              width={50}
              height={50}
            />
          </Link>
        )}
      </div>
    </div>
  );
}
