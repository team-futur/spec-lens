import { PRIVACY_CONTENT, PolicyLayout } from '@/widgets/policy';

export function PrivacyPage() {
  return (
    <PolicyLayout title='개인정보처리방침' lastUpdated='2024. 01. 01'>
      {PRIVACY_CONTENT}
    </PolicyLayout>
  );
}
