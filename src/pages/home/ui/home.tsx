import { HASH_TO_SCROLL_ITEMS } from '@/entities/menu';
import type { PortfolioItem } from '@/entities/portfolio';
import { AboutSection } from '@/widgets/about';
import { ContactSection } from '@/widgets/contact';
import { FeaturesSection } from '@/widgets/features';
import { HeroSection } from '@/widgets/hero';
import { PortfolioSection } from '@/widgets/portfolio';
import { ServicesSection } from '@/widgets/services';

/**
 * 1. 에디터 수정하고 기능 추가하기
 * 2. 개개인 스킬, 능력, 연차 추가
 * 2. 아티클 칩 색 구분 수정
 * 3. 포트폴리오 실제로 수정
 * 4. sitemap.xml 업데이트
 **/
export function Home({ portfolioItems }: { portfolioItems: PortfolioItem[] }) {
  return (
    <main
      style={{
        flex: 1,
        color: '#ffffff',
        backgroundColor: '#050505',
      }}
    >
      <div id='hero'>
        <HeroSection />
      </div>
      <div id={HASH_TO_SCROLL_ITEMS.find((item) => item.label === 'Company')?.id}>
        <AboutSection />
      </div>
      <div id={HASH_TO_SCROLL_ITEMS.find((item) => item.label === 'Features')?.id}>
        <FeaturesSection />
      </div>
      <div id={HASH_TO_SCROLL_ITEMS.find((item) => item.label === 'Services')?.id}>
        <ServicesSection />
      </div>
      <div id={HASH_TO_SCROLL_ITEMS.find((item) => item.label === 'Portfolio')?.id}>
        <PortfolioSection portfolioItems={portfolioItems} />
      </div>
      <ContactSection />
    </main>
  );
}
