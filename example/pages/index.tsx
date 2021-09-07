import React from 'react';
import dynamic from 'next/dynamic';

const GridWithoutSSR = dynamic(() => import('../components/grid'), {
  ssr: false,
});

export default function Home() {
  return <GridWithoutSSR></GridWithoutSSR>;
}
