// front/src/features/header/components/Header.tsx
import React from "react";
import '../styles.scss';
import HamburgerMenu from '../../nav/HamburgerMenu';

const Header: React.FC = () => {
    return (
        <header className="header_root">
            <div className="header_image_container">
                <picture>
                    <source 
                        media="(max-width: 699px)" 
                        srcSet="https://bhair.online/media/default/header_mobile.png" 
                    />
                    <img 
                        src="https://bhair.online/media/default/header_desktop.png" 
                        alt="Header" 
                        className="header_image" 
                    />
                </picture>
                {/* Размещаем кнопку внутри header, чтобы в закрытом состоянии она была в правом нижнем углу */}
                <HamburgerMenu />
            </div>
        </header>
    );
};

export default Header;
