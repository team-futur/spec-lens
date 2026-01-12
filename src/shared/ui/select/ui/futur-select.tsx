import { FlexRow } from '@jigoooo/shared-ui';
import { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface FuturSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
  placeholder?: string;
}

export function FuturSelect({
  options,
  value,
  onChange,
  width = '1.2rem',
  placeholder,
}: FuturSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Prevent editor from losing focus when clicking dropdown
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width }} onMouseDown={preventFocusLoss}>
      <FlexRow
        onClick={() => setIsOpen(!isOpen)}
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 0.8rem',
          backgroundColor: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0.4rem',
          cursor: 'pointer',
          color: '#fff',
          fontSize: '1.4rem',
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select'}</span>
        <ChevronDown size={16} />
      </FlexRow>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.4rem)',
            left: 0,
            width: '100%',
            backgroundColor: '#333',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.4rem',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              style={{
                padding: '0.8rem',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '1.4rem',
                transition: 'background-color 0.2s',
                backgroundColor:
                  value === option.value ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
