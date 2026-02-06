// front/src/features/services/components/ServiceCard.tsx
import React from 'react';
import { Service } from '../model/types';
import { Link } from 'react-router-dom';
import styles from './serviceCard.module.scss';

interface Props {
  service: Service;
}

const ServiceCard: React.FC<Props> = ({ service }) => {
  const handleClick = () => {
    // запоминаем позицию скролла перед переходом на детальную
    sessionStorage.setItem('services_scroll', String(window.scrollY));
    sessionStorage.setItem('services_restore', '1');
  };

  return (
    <Link
      to={`/services/${service.slug}`}
      className={styles.card}
      aria-label={service.title}
      onClick={handleClick}
    >
      <div className={styles.imageWrap}>
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.title}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>

      <div className={styles.content}>
        <div className={styles.title}>{service.title}</div>
        {service.short_description && (
          <p className={styles.desc}>{service.short_description}</p>
        )}
        <div className={styles.price}>
          от {Number(service.price).toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
