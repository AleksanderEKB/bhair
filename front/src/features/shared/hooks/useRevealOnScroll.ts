// front/src/shared/hooks/useRevealOnScroll.ts
import { useEffect, useRef, useState } from 'react';

export type RevealOptions = {
  /** Начинать анимацию, когда элемент виден на N% */
  threshold?: number;
  /** Отступы rootMargin для раннего/позднего триггера */
  rootMargin?: string;
  /** Запускать анимацию только один раз (не скрывать при уходе с экрана) */
  once?: boolean;
};

export function useRevealOnScroll({
  threshold = 0.2,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Если пользователь просит уменьшить анимации — показываем сразу
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
