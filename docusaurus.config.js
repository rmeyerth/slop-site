// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'SLOP - Expression Language',
  tagline: 'Dynamically configure your projects away from code deployments',
  url: 'http://www.slop.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/slop.ico',
  organizationName: 'tronied', // Usually your GitHub org/user name.
  projectName: 'slop', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://gitlab.com/tronied/slop',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://gitlab.com/tronied/slop',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [{name: 'keywords', content: 'expression, language'}],
      image: 'img/slop-pic.png',
      navbar: {
        title: 'SLOP',
        logo: {
          alt: 'Single Line Operations Processor (SLOP)',
          src: 'img/slop-pic.png',
        },
        items: [
          {to: '/blog', label: 'News', position: 'left'},
          {to: '/quick-start', label: 'Quick Start', position: 'left'},
          {to: '/why', label: 'Why?', position: 'left'},
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
          {to: '/try-it', label: 'Try it now!', position: 'left'},
          {to: '/license', label: 'License', position: 'left'},
          {
            href: 'https://gitlab.com/tronied/slop',
            label: 'Gitlab',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Quick Start',
                to: '/quick-start',
              },
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'http://slop.boards.net',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'News',
                to: '/blog',
              },
              {
                label: 'Gitlab',
                href: 'https://gitlab.com/tronied/slop',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Robert Meyer. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java'],
      },
    }),
};

module.exports = config;
