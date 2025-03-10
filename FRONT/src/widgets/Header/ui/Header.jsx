import React from "react";
import styles from "./style.module.scss";

import logo from "../../../shared/assets/images/logo.png";

function Header() {
    return (
        <header className={`w-full h-[10vh] ${styles.header}`}>
            <img className="w-[12%] h-auto" src={logo} alt="Logo" />
            <nav className="w-[30%] flex justify-between text-black">
                <a href="" className="font-extralight text-[18px]">
                    Каталог
                </a>
                <a href="" className="font-extralight text-[18px]">
                    Услуги
                </a>
                <a href="" className="font-extralight text-[18px]">
                    Отзывы
                </a>
                <a href="" className="font-extralight text-[18px]">
                    Для партнеров
                </a>
            </nav>

            <button className="border-2 border-[#BE8C55] rounded-[2px] px-4 py-2">
                <p className="font-extralight text-[18px]">
                    Рассчитать стоимость
                </p>
            </button>
        </header>
    );
}

export default Header;
