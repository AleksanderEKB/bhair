// front/src/features/header/components/Header.tsx
import React from "react";
import '../styles.scss';
import HamburgerMenu from '../../nav/HamburgerMenu';

interface HeaderProps {
    sticky?: boolean; // по умолчанию true (как было)
}

const Header: React.FC<HeaderProps> = ({ sticky = true }) => {
    return (
        <header className={`header_root ${!sticky ? 'notSticky' : ''}`}>
            <div className="header_image_container">
                <picture>
                    <source 
                        media="(max-width: 699px)" 
                        srcSet="https://bhair.pro/media/default/header_mobile.jpeg" 
                    />
                    <img 
                        src="https://bhair.pro/media/default/header_desktop.jpeg" 
                        alt="Header" 
                        className="header_image" 
                    />
                </picture>
                {/* Кнопка гамбургера внутри header */}
                <HamburgerMenu />
            </div>
        </header>
    );
};

export default Header;
