'use client';
import { useTranslation } from 'react-i18next';

export default function SearchLabel({ className = '' }) {
  const { t } = useTranslation();
  return <span className={`text-xs text-[#171717] font-normal ${className}`}>{t('search')}</span>;
}
