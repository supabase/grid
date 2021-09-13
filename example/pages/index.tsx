import React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const GridWithoutSSR = dynamic(() => import('../components/grid'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Supabase Grid Example</title>
      </Head>
      <GridWithoutSSR></GridWithoutSSR>
    </>
  );
}
