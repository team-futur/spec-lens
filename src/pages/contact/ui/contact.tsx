import { ContactForm, ContactInfo } from '@/widgets/contact';

export function ContactPage() {
  return (
    <main
      style={{
        flex: 1,
        backgroundColor: '#050505',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          padding: '12rem 2rem 8rem',
          maxWidth: '120rem',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1
            style={{
              fontSize: 'clamp(4rem, 8vw, 6.4rem)',
              fontWeight: 800,
              marginBottom: '2.4rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #00b4ff 50%, #0066ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.2rem',
              lineHeight: 1.2,
              paddingBottom: '0.5rem',
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              fontSize: '1.8rem',
              color: '#888',
              maxWidth: '60rem',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Futur와 함께할 준비가 되셨나요?
            <br />
            아래 양식을 작성해주시거나 직접 연락주시면 빠르게 답변 드리겠습니다.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(28rem, 1fr))',
            gap: 'clamp(4rem, 5vw, 8rem)',
            alignItems: 'start',
          }}
        >
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
