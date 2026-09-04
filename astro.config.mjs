// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
// @ts-ignore
import remarkMath from 'remark-math';
// @ts-ignore
import rehypeKatex from 'rehype-katex';

export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: '학습 노트 & 강의',
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
			customCss: [
				'katex/dist/katex.min.css',
			],
		}),
	],
});