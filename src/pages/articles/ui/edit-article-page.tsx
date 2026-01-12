import { FlexColumn } from '@jigoooo/shared-ui';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { type Article, updateArticle } from '@/entities/article';
import { ArticleEditor } from '@/widgets/articles';

export function EditArticlePage({ article }: { article: Article }) {
  const navigate = useNavigate();

  const handleUpdateArticle = async (data: { title: string; content: string }) => {
    await updateArticle({
      data: {
        ...article,
        title: data.title,
        content: data.content,
      },
    });
    toast.success('게시글이 성공적으로 수정되었습니다');
    navigate({ to: '/articles/$articleId', params: { articleId: article.id } });
  };

  return (
    <FlexColumn style={{ gap: '4rem', color: 'white', flex: 1 }}>
      <h1 style={{ fontSize: '3.2rem', fontWeight: 700, margin: 0 }}>글 수정</h1>
      <ArticleEditor
        onSubmit={handleUpdateArticle}
        initialData={{ title: article.title, content: article.content }}
      />
    </FlexColumn>
  );
}
