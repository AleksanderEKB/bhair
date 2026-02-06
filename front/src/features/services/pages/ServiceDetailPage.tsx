// front/src/features/services/pages/ServiceDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { clearDetail, fetchServiceBySlug } from '../model/slice';
import styles from './serviceDetail.module.scss';

const ServiceDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { detail, loadingDetail, errorDetail } = useAppSelector((s) => s.services);

  useEffect(() => {
    if (slug) {
      dispatch(fetchServiceBySlug(slug));
    }
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, slug]);

  if (loadingDetail) return <div className={styles.center}>Загрузка...</div>;
  if (errorDetail) return <div className={styles.centerError}>Ошибка: {errorDetail}</div>;
  if (!detail) return null;

  const priceNumber = Number(detail.price);

  const handleBackClick = () => {
    // гарантируем, что список будет пытаться восстановить скролл
    if (!sessionStorage.getItem('services_restore')) {
      sessionStorage.setItem('services_restore', '1');
    }
    navigate('/services');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          {detail.image_url ? (
            <img src={detail.image_url} alt={detail.title} className={styles.image} />
          ) : null}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{detail.title}</h1>
          <div className={styles.price}>
            от {priceNumber.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <div className={styles.desc}>{detail.description}</div>

          {/* Иконка "назад" справа снизу после описания */}
          <div className={styles.backRow}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={handleBackClick}
              aria-label="Назад к услугам"
              title="Назад к услугам"
            >
              <img src="/media/icons/back.svg" alt="" className={styles.backIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
