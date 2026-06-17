import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Amanoji — Watch Movies & TV Shows Free',
    short_name: 'Amanoji',
    description: 'Search and stream movies & TV shows instantly.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#8080cf',
    icons: [
      {
        src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>",
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
