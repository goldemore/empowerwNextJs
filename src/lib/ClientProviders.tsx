'use client';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/lib/i18n';
import LuxLoader from '@/components/LuxLoader';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [i18n, setI18n] = useState<any>(null);

  useEffect(() => {
    const instance = getI18n();
    if (instance) setI18n(instance);
  }, []);

  if (!i18n) return <LuxLoader/>; // или <></>

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
