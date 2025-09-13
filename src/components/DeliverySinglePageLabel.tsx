'use client';
import { useTranslation } from 'react-i18next';

export default function DeliveryLabel() {
  const { t } = useTranslation();
  return <>{t('add_to_cart.delivery_time')}</>;
}
