'use client';
import { useTranslation } from 'react-i18next';

export default function ShopNewLabel() {
  const { t } = useTranslation();
  return <>{t('shop_new')}</>;
}
