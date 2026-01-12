import { FlexColumn } from '@jigoooo/shared-ui';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createArticle } from '@/entities/article';
import { ArticleEditor } from '@/widgets/articles';

export function NewArticlePage() {
  const navigate = useNavigate();

  const handleCreateArticle = async (data: { title: string; content: string }) => {
    await createArticle({
      data: {
        title: data.title,
        date: new Date().toISOString().split('T')[0],
        summary: data.content.substring(0, 100) + '...',
        content: data.content,
        tags: ['New', 'Updates'],
      },
    });
    toast.success('게시글이 성공적으로 발행되었습니다');
    navigate({ to: '/articles' });
  };

  return (
    <FlexColumn style={{ gap: '4rem', color: 'white', flex: 1 }}>
      <h1 style={{ fontSize: '3.2rem', fontWeight: 700, margin: 0 }}>새 글 작성</h1>
      <ArticleEditor onSubmit={handleCreateArticle} />
    </FlexColumn>
  );
}
