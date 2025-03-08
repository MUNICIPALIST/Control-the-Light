import styles from "../ui/style.module.scss";

import curtainImg from "../../../shared/assets/images/curtain.png";
import frameImg from "../../../shared/assets/images/frame.jpg";

function HeroSection() {
    return (
        <section
            className={`w-full h-[130vh] gap-5 flex px-[10%] ${styles.section}`}
        >
            <div className="relative w-full flex justify-between mx-auto overflow-hidden rounded-lg pl-[10%] bg-[#BE8C55]">
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
                <div className="relative w-full z-10 flex items-center">
                    <h1 className="text-white text-7xl font-bold leading-tight max-w-[90%]">
                        Шторы с электрическим приводом под ключ
                    </h1>
                </div>
                <img className="w-auto h-[55vh]" src={curtainImg} alt="" />
            </div>
            <div className="flex gap-5 justify-between">
                <div className="relative w-full flex justify-between mx-auto overflow-hidden rounded-lg pl-[5%] bg-[#BE8C55]">
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]" />
                    <div className="relative w-full z-10 flex flex-col gap-4 justify-center">
                        <h2 className="text-white text-5xl font-bold leading-tight max-w-[90%]">
                            Услуги
                        </h2>
                        <p className="text-white text-3xl font-light">
                            Срок службы 20+ лет <br />
                            Бесшумные электрокарнизы <br />
                            Санкт-Петербург и Москва <br />
                            От идеи до реализации от 3-х дней
                        </p>
                    </div>
                </div>
                <div className="relative w-full flex justify-between mx-auto overflow-hidden rounded-lg">
                    <img className="w-full h-auto" src={frameImg} alt="" />
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
