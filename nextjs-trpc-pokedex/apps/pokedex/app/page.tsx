import styles from './page.module.css';
import { api } from './api-util';
import Image from 'next/image';
import Link from 'next/link';

export default async function Index() {
  const data = await api.greeting.getGreeting.query();
  const pokemon = await api.pokemon.getAll.query();
  return (
    <div className={styles['page']}>
      <h1>{data.message}</h1>
      <div className={styles['pokemon-grid']}>
        {pokemon.map((x) => (
          <Link href={`/${x.id}`} className={styles['pokemon-link']} key={x.id}>
            <Image
              src={x.sprites.front_default}
              alt={x.name}
              height={100}
              width={100}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
