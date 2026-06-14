// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://jackdo68.github.io',
	base: '/system-design-interview',
	integrations: [
		// astro-mermaid must come before starlight
		mermaid({
			theme: 'default',
			autoTheme: true,
		}),
		starlight({
			title: 'System Design Manual',
			description:
				'A runbook for anyone preparing for a system design interview — distributed systems, payments, security, operations.',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: false,
			},
			favicon: '/favicon.svg',
			head: [
				// Social-share card (og:image / Twitter)
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://jackdo68.github.io/system-design-interview/og.png',
					},
				},
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://jackdo68.github.io/system-design-interview/og.png',
					},
				},
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/jackdo68/system-design-interview',
				},
			],
			customCss: ['./src/styles/theme.css'],
			lastUpdated: true,
			tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'The Principal Mindset', slug: 'start/mindset' },
						{ label: 'The Interview Framework', slug: 'start/framework' },
						{ label: 'Trade-off Axes', slug: 'start/trade-offs' },
					],
				},
				{
					label: 'Core Concepts',
					collapsed: false,
					items: [
						{ label: 'Scalability', slug: 'concepts/scalability' },
						{ label: 'Caching', slug: 'concepts/caching' },
						{ label: 'Resilience Patterns', slug: 'concepts/resilience' },
						{ label: 'Idempotency', slug: 'concepts/idempotency' },
						{ label: 'Consistency & Data', slug: 'concepts/consistency' },
						{ label: 'Observability', slug: 'concepts/observability' },
						{ label: 'SLI / SLO / SLA', slug: 'concepts/slo' },
						{ label: 'Customer Experience', slug: 'concepts/customer-experience' },
						{ label: 'Security & Risk', slug: 'concepts/security' },
						{ label: 'DevSecOps & Delivery', slug: 'concepts/devsecops' },
						{ label: 'Testing', slug: 'concepts/testing' },
						{ label: 'Chaos & DR', slug: 'concepts/chaos-dr' },
						{ label: 'Leadership', slug: 'concepts/leadership' },
					],
				},
				{
					label: 'Deep Dives',
					collapsed: true,
					items: [
						{ label: 'Caching Internals', slug: 'deep-dives/caching' },
						{ label: 'Reliability Toolkit', slug: 'deep-dives/reliability' },
						{ label: 'Idempotency in Practice', slug: 'deep-dives/idempotency' },
						{ label: 'Regions, Cells & Blast Radius', slug: 'deep-dives/blast-radius' },
						{ label: 'Sharding & Partitions', slug: 'deep-dives/sharding' },
						{ label: 'Multi-Tenancy', slug: 'deep-dives/multi-tenancy' },
						{ label: 'Disaster Recovery', slug: 'deep-dives/disaster-recovery' },
						{ label: 'Load Shedding & Bottlenecks', slug: 'deep-dives/load-shedding' },
						{ label: 'Alerting', slug: 'deep-dives/alerting' },
						{ label: '3D Secure', slug: 'deep-dives/3ds' },
						{ label: 'Supply-Chain Security', slug: 'deep-dives/supply-chain' },
					],
				},
				{
					label: 'Worked Design',
					items: [{ label: 'Money-Movement Platform', slug: 'worked-design/money-movement' }],
				},
				{
					label: 'Australia 2026',
					collapsed: true,
					items: [
						{ label: 'Regulatory & Market Context', slug: 'australia-2026/context' },
					],
				},
				{
					label: 'Practice',
					items: [
						{ label: 'Question Bank', slug: 'practice/question-bank' },
						{ label: 'Quick-Reference Cheat Sheet', slug: 'practice/cheat-sheet' },
					],
				},
			],
		}),
	],
});
