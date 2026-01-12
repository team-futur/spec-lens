/// <reference types="vite/client" />
import 'react-lazy-load-image-component/src/effects/blur.css';

import { type QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext } from '@tanstack/react-router';

import cssUrl from '../styles/index.css?url';
import { RootCatchBoundary, RootComponent, RootNotFound } from '@/pages/root';

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {},
  head: () => ({
    links: [
      {
        rel: 'icon',
        href: `${process.env.VITE_PRODUCTION_API_URL}/logo.svg`,
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        href: `${process.env.VITE_PRODUCTION_API_URL}/logo_48x48.png`,
        type: 'image/png',
        sizes: '48x48',
      },
      {
        rel: 'icon',
        href: `${process.env.VITE_PRODUCTION_API_URL}/logo_96x96.png`,
        type: 'image/png',
        sizes: '96x96',
      },
      {
        rel: 'icon',
        href: `${process.env.VITE_PRODUCTION_API_URL}/logo_144x144.png`,
        type: 'image/png',
        sizes: '144x144',
      },
      {
        rel: 'apple-touch-icon',
        href: `${process.env.VITE_PRODUCTION_API_URL}/logo_180x180.png`,
        sizes: '180x180',
      },
      { rel: 'canonical', href: `${process.env.VITE_PRODUCTION_API_URL}` },
      {
        rel: 'preload',
        href: '/fonts/PretendardVariable.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: cssUrl,
      },
    ],
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },

      // PWA & Mobile
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Futur' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'format-detection', content: 'telephone=no' },

      // Microsoft / Windows
      { name: 'msapplication-TileColor', content: '#0a0a0a' },
      { name: 'msapplication-TileImage', content: '/logo_144x144.png' },

      // Verification (Placeholders)
      // { name: 'naver-site-verification', content: 'YOUR_NAVER_VERIFICATION_CODE' },
      // { name: 'google-site-verification', content: 'YOUR_GOOGLE_VERIFICATION_CODE' },
      { title: "Futur - Building Tomorrow's Technology Today" },
      {
        name: 'description',
        content:
          '혁신적인 SI 솔루션으로 비즈니스의 미래를 설계합니다. 맞춤형 시스템 통합, 엔터프라이즈 솔루션, IT 전략 컨설팅을 제공합니다.',
      },
      {
        name: 'keywords',
        content: 'SI, 시스템통합, 소프트웨어개발, 기술컨설팅, 익산, 웹개발, 앱개발',
      },
      // Basic SEO
      { name: 'application-name', content: 'Futur' },
      { name: 'referrer', content: 'origin-when-cross-origin' },
      { name: 'author', content: 'Futur' },
      { name: 'creator', content: 'Futur Team' },
      { name: 'publisher', content: 'Futur' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'theme-color', content: '#0a0a0a' },
      { name: 'color-scheme', content: 'dark light' },

      // Geo / Location (Iksan, Jeonbuk based on keywords)
      { name: 'geo.region', content: 'KR-46' }, // Jeollabuk-do
      { name: 'geo.placename', content: 'Iksan-si' },
      { name: 'geo.position', content: '35.9483;126.9578' }, // Approx center of Iksan
      { name: 'ICBM', content: '35.9483, 126.9578' },

      // Open Graph / Facebook / Naver Blog
      { property: 'og:title', content: "Futur - Building Tomorrow's Technology Today" },
      {
        property: 'og:description',
        content:
          '혁신적인 SI 솔루션으로 비즈니스의 미래를 설계합니다. 맞춤형 시스템 통합, 엔터프라이즈 솔루션, IT 전략 컨설팅을 제공합니다.',
      },
      { property: 'og:url', content: `${process.env.VITE_PRODUCTION_API_URL}` },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'ko_KR' },
      { property: 'og:site_name', content: 'Futur' },
      // Main Image
      { property: 'og:image', content: `${process.env.VITE_PRODUCTION_API_URL}/futur_main.png` },
      {
        property: 'og:image:secure_url',
        content: `${process.env.VITE_PRODUCTION_API_URL}/futur_main.png`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Futur - Future Technology Solutions' },
      { property: 'og:image:type', content: 'image/png' },

      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: "Futur - Building Tomorrow's Technology Today" },
      {
        name: 'twitter:description',
        content:
          '혁신적인 SI 솔루션으로 비즈니스의 미래를 설계합니다. 웹/앱 개발 및 IT 컨설팅 전문.',
      },
      { name: 'twitter:site', content: '@Futur' },
      { name: 'twitter:creator', content: '@Futur' },
      { name: 'twitter:image', content: `${process.env.VITE_PRODUCTION_API_URL}/futur_main.png` },
      { name: 'twitter:image:alt', content: 'Futur Main Banner' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          // name: COMPANY_INFOS.NAME,
          // url: COMPANY_INFOS.URL,
          // logo: COMPANY_INFOS.LOGO_URL,
          // description: COMPANY_INFOS.DESCRIPTION,
          // address: {
          //   '@type': 'PostalAddress',
          //   addressLocality: COMPANY_INFOS.ADDRESS_ENGLISH.LOCALITY,
          //   addressRegion: COMPANY_INFOS.ADDRESS_ENGLISH.REGION,
          //   addressCountry: COMPANY_INFOS.ADDRESS_ENGLISH.COUNTRY,
          // },
          // contactPoint: {
          //   '@type': 'ContactPoint',
          //   contactType: 'customer support',
          //   email: COMPANY_INFOS.EMAIL,
          // },
        }),
      },
    ],
  }),
  component: RootComponent,
  errorComponent: RootCatchBoundary,
  notFoundComponent: RootNotFound,
});
