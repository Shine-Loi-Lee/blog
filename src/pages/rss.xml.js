// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const docs = await getCollection('docs');

  return rss({
    title: 'Shine on Me: Tech & Math Archive',
    description: 'Shine on Me: Tech & Math Archive',
    site: context.site,
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.description,
      link: `/${doc.slug}/`,
      pubDate: doc.data.date ? new Date(doc.data.date) : new Date(),
    })),
    customData: `<language>ko</language>`,
  });
}
