// front/src/shared/components/RevealOnScroll.tsx
import React from 'react';
import clsx from 'clsx';
import { useRevealOnScroll, RevealOptions } from '../hooks/useRevealOnScroll';
import styles from './reveal.module.scss';

type Props = {
  as?: React.ElementType;
  /** Доп. задержка анимации (мс) для стэггера */
  delayMs?: number;
  /** Сила «прыжка» (px) — исходный translate/scale */
  intensity?: 'soft' | 'base' | 'strong';
  options?: RevealOptions;
} & React.HTMLAttributes<HTMLElement>;

const intensityClass: Record<NonNullable<Props['intensity']>, string> = {
  soft: 'soft',
  base: 'base',
  strong: 'strong',
};

const RevealOnScroll: React.FC<Props> = ({
  as: Component = 'div',
  delayMs = 0,
  intensity = 'base',
  options,
  className,
  children,
  ...rest
}) => {
  const { ref, visible } = useRevealOnScroll(options);

  return (
    <Component
      // ref типизируем через any из-за полиморфности as
      ref={ref as any}
      className={clsx(
        styles.reveal,
        styles[intensityClass[intensity]],
        visible && styles.isVisible,
        className
      )}
      style={delayMs ? { animationDelay: `${Math.max(0, delayMs)}ms` } : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default RevealOnScroll;
