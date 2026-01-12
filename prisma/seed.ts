import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PrismaClient } from '../src/generated/prisma/client.js';

// Get absolute path for SQLite database (in project root)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '..', 'specLens.db');
const dbUrl = `file://${dbPath}`;

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.contact.deleteMany();
  await prisma.article.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('1234', 12);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✅ Created admin user:', adminUser.username);

  // Create articles
  const articles = await prisma.article.createMany({
    data: [
      {
        id: '1',
        title: 'Futur 홈페이지 리뉴얼',
        date: '2025-01-01',
        summary:
          '현대적인 디자인으로 홈페이지를 리뉴얼했습니다. 새로운 기능과 개선된 사용자 경험을 확인해보세요.',
        content: `<h2>새로운 시작, Futur 리뉴얼</h2>

<p>Futur가 2025년을 맞아 홈페이지를 전면 리뉴얼했습니다. 이번 리뉴얼은 '사용자 중심의 경험'과 '미래지향적 디자인'을 핵심 가치로 삼았습니다.</p>
<h3>주요 변경 사항</h3>
<ul>
  <li><strong>현대적인 디자인:</strong> 다크 모드를 기반으로 한 세련된 UI를 적용하여 몰입감을 높였습니다.</li>
  <li><strong>향상된 성능:</strong> 최신 웹 기술을 도입하여 로딩 속도와 반응성을 획기적으로 개선했습니다.</li>
  <li><strong>직관적인 내비게이션:</strong> 원하는 정보를 더 쉽고 빠르게 찾을 수 있도록 메뉴 구조를 개편했습니다.</li>
</ul>
<p>앞으로도 Futur는 끊임없는 혁신을 통해 더 나은 서비스를 제공하겠습니다. 여러분의 많은 관심과 피드백 부탁드립니다.</p>`,
        tags: JSON.stringify(['뉴스', '디자인']),
      },
      {
        id: '2',
        title: 'TanStack Router를 선택한 이유',
        date: '2025-01-05',
        summary: '새로운 라우팅 시스템에 대한 기술적 의사 결정 과정을 심층적으로 다룹니다.',
        content: `<h2>왜 TanStack Router인가?</h2>
<p>React 생태계에는 많은 라우터 라이브러리가 존재합니다. React Router가 오랫동안 표준처럼 여겨졌지만, 최근 TanStack Router가 강력한 대안으로 떠오르고 있습니다.</p>
<h3>타입 안전성 (Type Safety)</h3>
<p>TanStack Router의 가장 큰 장점은 완벽한 타입 안전성입니다. URL 파라미터, 검색 쿼리, 라우트 이동까지 모든 것이 타입으로 정의되어 있어 개발 단계에서 실수를 방지할 수 있습니다.</p>
<h3>Search Params 관리</h3>
<p>URL 쿼리 파라미터를 상태처럼 관리할 수 있는 강력한 기능을 제공합니다. 이를 통해 필터링, 검색, 페이지네이션 등의 기능을 URL과 동기화하여 쉽게 구현할 수 있습니다.</p>
<h3>결론</h3>
<p>유지보수성과 개발 생산성을 고려했을 때, TanStack Router는 Futur의 프로젝트에 가장 적합한 선택이었습니다.</p>`,
        tags: JSON.stringify(['기술', 'React']),
      },
      {
        id: '3',
        title: 'SI 솔루션의 미래',
        date: '2025-01-08',
        summary:
          '시스템 통합(SI) 분야의 다가오는 트렌드와 Futur가 이를 어떻게 준비하고 있는지 알아봅니다.',
        content: `<h2>SI 산업의 변화</h2>
<p>전통적인 SI(System Integration) 산업은 빠르게 변화하고 있습니다. 클라우드 네이티브, AI 도입, 마이크로서비스 아키텍처 등 새로운 기술 트렌드가 산업의 표준을 바꾸고 있습니다.</p>
<h3>Futur의 전략</h3>
<p>Futur는 단순한 개발 대행을 넘어, 고객의 비즈니스 가치를 창출하는 IT 파트너를 지향합니다.</p>
<ul>
  <li><strong>AI 기반 솔루션:</strong> 업무 효율화를 위한 AI 도입 컨설팅 및 개발</li>
  <li><strong>클라우드 전환:</strong> 레거시 시스템의 현대화 및 클라우드 마이그레이션</li>
  <li><strong>애자일 방법론:</strong> 빠른 피드백과 지속적인 개선을 통한 프로젝트 성공</li>
</ul>
<p>Futur와 함께 비즈니스의 미래를 준비하세요.</p>`,
        tags: JSON.stringify(['인사이트', '비즈니스']),
      },
    ],
  });
  console.log('✅ Created', articles.count, 'articles');

  // Create portfolio items
  const portfolioItems = await prisma.portfolio.createMany({
    data: [
      {
        id: 1,
        title: '글로벌 E-커머스 플랫폼',
        category: 'E-commerce',
        description: '50개국 이상을 연결하는 통합 결제 및 물류 시스템 구축.',
        gradient: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        image: '/assets/images/portfolio/ecommerce.png',
        fullDescription:
          '50개국 이상을 연결하는 통합 결제 게이트웨이와 물류 추적 시스템을 갖춘 포괄적인 이커머스 솔루션입니다. 대규모 트래픽과 국경 간 거래에 최적화되어 글로벌 비즈니스 확장을 지원합니다.',
        technologies: JSON.stringify(['React', 'Node.js', 'AWS', 'Stripe']),
        client: '글로벌 리테일 Corp',
        year: '2025',
      },
      {
        id: 2,
        title: '스마트 시티 대시보드',
        category: 'IoT / Big Data',
        description: '도시 인프라 관리를 위한 실시간 모니터링 시스템.',
        gradient: 'linear-gradient(135deg, #0a1f33 0%, #11304d 100%)',
        image: '/assets/images/portfolio/smart-city.png',
        fullDescription:
          '교통 흐름, 에너지 소비, 응급 서비스 현황 등 도시 인프라 데이터를 실시간으로 시각화하여 효율적인 도시 운영을 돕는 대시보드입니다. 시 정부를 위해 구축되었습니다.',
        technologies: JSON.stringify(['Vue.js', 'D3.js', 'Python', 'Kafka']),
        client: '메트로폴리스 시티',
        year: '2024',
      },
      {
        id: 3,
        title: '핀테크 모바일 앱',
        category: 'Finance',
        description: 'AI 기반 자산 관리를 제공하는 차세대 뱅킹 경험.',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        image: '/assets/images/portfolio/fintech.png',
        fullDescription:
          'AI 기반의 개인화된 자산 관리 조언과 간편한 P2P 송금 기능을 갖춘 안전하고 직관적인 모바일 뱅킹 애플리케이션입니다.',
        technologies: JSON.stringify(['Flutter', 'Go', 'PostgreSQL', 'TensorFlow']),
        client: '네오뱅크 Inc.',
        year: '2024',
      },
      {
        id: 4,
        title: '헬스케어 AI 솔루션',
        category: 'Healthcare',
        description: '딥러닝 기술을 활용한 진단 보조 시스템.',
        gradient: 'linear-gradient(135deg, #0f1c2e 0%, #1f2a3d 100%)',
        image: '/assets/images/portfolio/healthcare.png',
        fullDescription:
          '의료 영상 데이터를 높은 정확도로 분석하여 의료진의 진단을 보조하는 AI 기반 진단 지원 도구입니다.',
        technologies: JSON.stringify(['React Native', 'Python', 'PyTorch', 'DICOM']),
        client: '메디테크 솔루션즈',
        year: '2023',
      },
    ],
  });
  console.log('✅ Created', portfolioItems.count, 'portfolio items');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
