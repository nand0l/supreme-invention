import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NLU-Amazon Nova Tools',
  tagline: 'Nova is cool',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://nova.gk-demo.net',
  baseUrl: '/',

  organizationName: 'gk-demo',
  projectName: 'nlu-nova',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'manifest', href: '/site.webmanifest' },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'NLU-Docusaurus',
      logo: {
        alt: 'My Site Logo',
        src: 'img/android-chrome-192x192.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Menu',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/nand0l/supreme-invention',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NLU-SKS. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // ✅ Add this section for global TOC control
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 2,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
