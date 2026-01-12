import { FlexColumn, FlexRow } from '@jigoooo/shared-ui';
import { Link, useNavigate, useRouter, useRouteContext } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { useState } from 'react';

import { ArrowLeft, Calendar, Edit, Trash } from 'lucide-react';

import { type Article, deleteArticle } from '@/entities/article';
import { ConfirmModal } from '@/shared/ui/confirm-modal';

export function ArticleDetailPage({ article }: { article: Article }) {
  const { user } = useRouteContext({ from: '__root__' });
  const isAuthenticated = Boolean(user);
  const router = useRouter();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    await deleteArticle({ data: article.id });
    await router.invalidate();
    await navigate({ to: '/articles' });
  };

  return (
    <FlexColumn
      style={{
        width: '100%',
        maxWidth: '80rem',
        margin: '0 auto',
        paddingBottom: '10rem',
        gap: '4rem',
      }}
    >
      {/* Navigation */}
      <FlexRow style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to='/articles'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              color: '#888',
              textDecoration: 'none',
              fontSize: '1.6rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
          >
            <ArrowLeft size={20} />
            목록으로 돌아가기
          </Link>
        </motion.div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <button
              onClick={handleDelete}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: '#ff6b6b',
                textDecoration: 'none',
                fontSize: '1.6rem',
                padding: '0.8rem 1.6rem',
                borderRadius: '0.8rem',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
              }}
            >
              <Trash size={16} />
              삭제하기
            </button>
            <Link
              to='/articles/$articleId/edit'
              params={{ articleId: article.id }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: '#888',
                textDecoration: 'none',
                fontSize: '1.6rem',
                padding: '0.8rem 1.6rem',
                borderRadius: '0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <Edit size={16} />
              수정하기
            </Link>
          </motion.div>
        )}
      </FlexRow>

      {/* Header */}
      <FlexColumn style={{ gap: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          {article.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '1.4rem',
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '0.4rem 1.2rem',
                borderRadius: '100rem',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 'clamp(3.2rem, 5vw, 4.8rem)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {article.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            color: '#888',
            fontSize: '1.6rem',
          }}
        >
          <Calendar size={18} />
          {article.date}
        </motion.div>
      </FlexColumn>

      {/* Content */}
      <div
        style={{
          fontSize: '1.8rem',
          lineHeight: 1.8,
          color: '#ddd',
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(article.content || ''),
        }}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title='게시글 삭제'
        description='정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.'
        confirmLabel='삭제'
        variant='danger'
      />
    </FlexColumn>
  );
}
