import { getRouteApi } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import {
  PortfolioDetailBackLink,
  PortfolioDetailContent,
  PortfolioDetailHeader,
  PortfolioDetailHero,
  PortfolioDetailInfo,
} from '@/widgets/portfolio';

const routeApi = getRouteApi('/_main/portfolio/$portfolioId');

export function PortfolioDetail() {
  const { item } = routeApi.useLoaderData();

  if (!item) return null;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#050505',
        position: 'relative',
      }}
    >
      <div
        style={{
          padding: '12rem 2rem',
          minHeight: '100%',
          maxWidth: '100rem',
          margin: '0 auto',
          color: '#fff',
          width: '100%',
        }}
      >
        <PortfolioDetailBackLink />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PortfolioDetailHero gradient={item.gradient} image={item.image} title={item.title} />
          <PortfolioDetailHeader category={item.category} title={item.title} />
          <PortfolioDetailInfo
            client={item.client}
            year={item.year}
            technologies={item.technologies}
          />
          <PortfolioDetailContent description={item.fullDescription || item.description} />
        </motion.div>
      </div>
    </div>
  );
}
