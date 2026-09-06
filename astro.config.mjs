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
    				label: 'Categories',
			    	link: '/categories/',
				},
				{
			    	label: 'Mathematics',
					collapsed: true,
			    	items: [{
						label: 'Linear Algebra',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'math/linear-algebra',
								},
							},
						],
					}],
				},
  				{
			    	label: 'Computer Science',
					collapsed: true,
			    	items: [{ autogenerate: { 
						directory: 'cs',
						collapsed: true,
					} }],
				},
  				{
    				label: 'Programming Languages',
					collapsed: true,
					items: [{
						label: 'Object-Oriented Paradigm',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/oop',
								},
							},
						],
					},
					{
						label: 'C++',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/cpp',
								},
							},
						],
					},
					{
						label: 'Python',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/python',
								},
							},
						],
					}
					],
  				},
  				{
    				label: 'Physics',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'physics',
						collapsed: true,
					} }],
  				},
  				{
    				label: 'Languages & Linguistics',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'lang',
						collapsed: true,
					} }],
  				},
				{
    				label: 'Projects',
			    	link: '/projects/',
				},
  				{
    				label: 'Beyond Tech',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'beyond',
						collapsed: true,
					} }],
  				},
  				{
    				label: 'Life',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'life',
						collapsed: true,
					} }],
  				},
			],
		}),
	],
});
