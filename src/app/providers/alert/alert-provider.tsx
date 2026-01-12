import { AlertDialog } from '@jigoooo/shared-ui';
import { Toaster } from 'sonner';

import { FaCircleCheck } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import { MdError } from 'react-icons/md';

import { useTheme } from '@/shared/theme';

export function AlertProvider() {
  const { theme } = useTheme();

  return (
    <>
      <AlertDialog />
      <Toaster
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #cccccc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '1.4rem',
          },
          duration: 1800,
        }}
        icons={{
          success: <FaCircleCheck style={{ color: theme.colors.successColor, fontSize: '2rem' }} />,
          warning: <IoIosWarning style={{ color: theme.colors.warningColor, fontSize: '2rem' }} />,
          error: <MdError style={{ color: theme.colors.errorColor, fontSize: '2rem' }} />,
        }}
        expand={true}
      />
    </>
  );
}
