// components/LastAddedLabel.tsx
'use client';
import { useTranslation } from 'react-i18next';
export default function AllProductsLabel() {
  const { t } = useTranslation();
  return <>{t('all_products')}</>;
}
