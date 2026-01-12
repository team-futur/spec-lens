import { FlexColumn, FlexRow } from '@jigoooo/shared-ui';
import { Link, useRouteContext } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import type { Article } from '@/entities/article';
import { ArticleList } from '@/widgets/articles';

interface ArticlesListPageProps {
  articles: Article[];
}

export function ArticlesListPage({ articles }: ArticlesListPageProps) {
  const { user } = useRouteContext({ from: '__root__' });
  const isAuthenticated = Boolean(user);

  return (
    <FlexColumn style={{ gap: '6rem', flex: 1, width: '100%' }}>
      {/* Header Section */}
      <FlexRow
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <FlexColumn style={{ gap: '1.2rem' }}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 'clamp(3.6rem, 5vw, 4.8rem)',
              fontWeight: 800,
              margin: 0,
              background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            인사이트 & 뉴스
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: '1.6rem',
              color: '#888',
              margin: 0,
              maxWidth: '50rem',
              lineHeight: 1.5,
            }}
          >
            최신 소식, 기술 심층 분석, 그리고 회사 업데이트를 확인하세요.
          </motion.p>
        </FlexColumn>

        {isAuthenticated && (
          <Link to='/articles/new'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                height: '4.8rem',
                padding: '0 2.4rem',
                fontSize: '1.6rem',
                fontWeight: 600,
                borderRadius: '10rem',
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(255,255,255,0.2)',
              }}
            >
              글 작성하기
            </motion.button>
          </Link>
        )}
      </FlexRow>

      {/* Articles Grid */}
      <ArticleList articles={articles} />
    </FlexColumn>
  );
}
