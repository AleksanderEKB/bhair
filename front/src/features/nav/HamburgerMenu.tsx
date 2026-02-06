// front/src/features/nav/HamburgerMenu.tsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hook';
import { selectIsAuth, selectUser } from '../auth/model/selectors';
import styles from './hamburger.module.scss';

type Props = {
  // Если true — кнопка меню всегда фиксирована в правом верхнем углу (даже когда меню закрыто).
  // Нужно для страниц без Header.
  fixedWhenClosed?: boolean;
};

const HamburgerMenu: React.FC<Props> = ({ fixedWhenClosed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(v => !v);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const buttonPositionClass =
    isOpen || fixedWhenClosed ? styles.iconFixedOpen : styles.iconInHeader;

  return (
    <div className={styles.hamburgerMenu} ref={menuRef}>
      <button
        type="button"
        aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isOpen}
        className={[
          styles.hamburgerIcon,
          buttonPositionClass,
          isOpen ? styles.openIcon : ''
        ].join(' ')}
        onClick={toggleMenu}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      <nav
        className={`${styles.menuContent} ${isOpen ? styles.open : ''}`}
        role="navigation"
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
        >
          Главная
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
        >
          Услуги
        </NavLink>

        {!isAuthenticated && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
          >
            Вход/Регистрация
          </NavLink>
        )}

        {isAuthenticated && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
          >
            Профиль
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default HamburgerMenu;
