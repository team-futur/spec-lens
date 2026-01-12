import { FlexColumn } from '@jigoooo/shared-ui';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { ArrowLeft, Lock } from 'lucide-react';

import { LoginForm } from '@/widgets/auth';

export function LoginPage() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(50,50,50,0.4) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(100,100,100,0.2) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        }}
        style={{
          width: '100%',
          maxWidth: '42rem',
          padding: '4rem',
          borderRadius: '3.2rem',
          backgroundColor: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4)',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '3.2rem',
        }}
      >
        <FlexColumn style={{ alignItems: 'center', gap: '1.2rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5 } }}
          >
            <div
              style={{
                width: '6rem',
                height: '6rem',
                borderRadius: '2rem',
                background: 'linear-gradient(135deg, #fff 0%, #666 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Lock color='#000' size={28} strokeWidth={2.5} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } }}
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            관리자 로그인
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
            style={{ fontSize: '1.5rem', color: '#888', textAlign: 'center', margin: 0 }}
          >
            관리자 패널에 접속하기 위해 로그인해주세요
          </motion.p>
        </FlexColumn>

        {/* Login Form Widget */}
        <LoginForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.7 } }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Link
            to='/'
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              color: '#666',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: 500,
              padding: '0.8rem 1.6rem',
              borderRadius: '100rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={16} />
            메인으로 돌아가기
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
