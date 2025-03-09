import styles from "../ui/style.module.scss";

import { Slider } from "../../../features/Slider";
import { SwiperSlider } from "../../../features/Swiper";

function Portfolio() {
  return (
    <section className={`${styles.slider} w-full mx-auto my-20 relative`}>
      <h2 className="flex items-center justify-center font-medium text-3xl mb-8">
        <span className="text-black mr-4 font-bold">Наши работы</span>
      </h2>
      {/* <Slider /> */}

      <SwiperSlider />
    </section>
  );
}

export default Portfolio;
