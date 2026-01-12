import { TERMS_CONTENT, PolicyLayout } from '@/widgets/policy';

export function TermsPage() {
  return (
    <PolicyLayout title='이용약관' lastUpdated='2024. 01. 01'>
      {TERMS_CONTENT}
    </PolicyLayout>
  );
}
