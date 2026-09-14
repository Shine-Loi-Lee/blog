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
		starlight({ // Starlight
			title: 'Shine on Me: Tech & Math Archive',
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			components: {
				Pagination: './src/components/CustomPagination.astro',
				MarkdownContent: './src/components/CustomMarkdownContent.astro',
			},
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
				{ // RSS
					tag: 'link',
					attrs: {
						rel: 'alternate',
						type: 'application/rss+xml',
						title: 'Shine on Me RSS Feed',
						href: '/rss.xml',
					},
				}, // RSS
			],
			sidebar: [{ // Home
    				label: 'Home',
			    	link: '/',
				}, // Home
				{ // Categories
    				label: 'Categories',
			    	link: '/categories/',
				}, // Categories
				{ // Mathematics
			    	label: 'Mathematics',
					collapsed: true,
			    	items: [{ // \Calculus
						label: 'Calculus',
						collapsed: true,
						items: [{autogenerate: {
									directory: 'math/calculus',
								}}],
						}, // \Calculus
						{ // \Linear Algebra
						label: 'Linear Algebra',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'math/linear-algebra',
								}}],
					}], // \Linear Algebra
				}, // Mathematics
				{ // Computer Science
			    	label: 'Computer Science',
					collapsed: true,
			    	items: [{ // \Programming Paradigms
						label: 'Programming Paradigms',
						collapsed: true,
						items: [{
							autogenerate: {
								directory: 'cs/programming-paradigms',
							}}],
					}], // \Programming Paradigms
				}, // Computer Science
				{ // Programming Languages
    				label: 'Programming Languages',
					collapsed: true,
					items: [{ // Programming Fundamentals
						label: 'Programming Fundamentals',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/programming-fundamentals',
								}}],
					}, // Programming Fundamentals
					{ // \C++
						label: 'C++',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/cpp',
								}}],
					}, // \C++
					{ // \Python
						label: 'Python',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'plang/python',
								}}],
					}], // \Python
  				}, // Programming Languages
				{ // Physics
    				label: 'Physics',
					collapsed: true,
    				items: [{ // Classical Mechanics
						label: 'Classical Mechanics',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'physics/classical-mechanics',
								}}],
					}, // Classical Mechanics
					{ // \Electromagnetism
						label: 'Electromagnetism',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'physics/em',
								}}],
					}, // \Electromagnetism
					{ // \Thermodynamics
						label: 'Thermodynamics',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'physics/thermo',
								}}],
					}, // \Thermodynamics
					{ // \Quantum Mechanics
						label: 'Quantum Mechanics',
						collapsed: true,
						items: [{
								autogenerate: {
									directory: 'physics/qm',
								}}],
					}], // \Quantum Mechanics
  				}, // Physics
				{ // Languages & Linguistics
    				label: 'Languages & Linguistics',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'lang',
						collapsed: true,
					}}],
  				}, // Languages & Linguistics
				{ // Projects
    				label: 'Projects',
			    	link: '/projects/',
				}, // Projects
				{ // Beyond Tech
    				label: 'Beyond Tech',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'beyond',
						collapsed: true,
					}}],
  				},// Beyond Tech
				{ // Life
    				label: 'Life',
					collapsed: true,
    				items: [{ autogenerate: { 
						directory: 'life',
						collapsed: true,
					}}],
  				} // Life
			], // Sidebar
		}), // Starlight
	],
}); // defineConfig
