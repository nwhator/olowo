import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OLOWO — AI Finance Operator',
    short_name: 'OLOWO',
    description: 'Autonomous AI money operator for African market traders and modern businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08111F',
    theme_color: '#00A878',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
