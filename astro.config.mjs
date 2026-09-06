// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// @ts-ignore
import remarkMath from 'remark-math';
// @ts-ignore
import rehypeKatex from 'rehype-katex';

export default defineConfig({
	site: 'https://shineonme.vercel.app/',
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: 'Shine on Me: Tech & Math Archive',
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: {
					label: '한국어',
					lang: 'ko',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
				ja: {
					label: '日本語',
					lang: 'ja',
				},
			},
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'alternate',
						type: 'application/rss+xml',
						title: 'Shine on Me RSS Feed',
						href: '/rss.xml',
					},
				},
			],
			sidebar: [
				{
			    	label: 'Mathematics',
			    	items: [
						{
							label: 'Linear Algebra',
							collapsed: true,
							autogenerate: { directory: 'math/linear-algebra' },
						},
					],
					collapsed: true,
				},
  				{
			    	label: 'Computer Science',
			    	items: [{ autogenerate: { 
						directory: 'cs',
						collapsed: true,
					} }],
					collapsed: true,
				},
  				{
    				label: 'Programming Languages',
    				items: [{ autogenerate: { 
						directory: 'plang',
						collapsed: true,
					} }],
					collapsed: true,
  				},
  				{
    				label: 'Physics',
    				items: [{ autogenerate: { 
						directory: 'physics',
						collapsed: true,
					} }],
					collapsed: true,
  				},
  				{
    				label: 'Languages & Linguistics',
    				items: [{ autogenerate: { 
						directory: 'lang',
						collapsed: true,
					} }],
					collapsed: true,
  				},
				{
    				label: 'Projects',
			    	link: '/projects/',
				},
  				{
    				label: 'Beyond Tech',
    				items: [{ autogenerate: { 
						directory: 'beyond',
						collapsed: true,
					} }],
					collapsed: true,
  				},
  				{
    				label: 'Life',
    				items: [{ autogenerate: { 
						directory: 'life',
						collapsed: true,
					} }],
					collapsed: true,
  				},
			],
		}),
	],
});
