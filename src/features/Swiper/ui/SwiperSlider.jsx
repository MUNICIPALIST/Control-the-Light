import { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { Navigation, EffectCoverflow, Autoplay } from "swiper/modules";
import styles from "../ui/style.module.scss";

const API_URL = "https://671e15491dfc429919813dc2.mockapi.io/reactpizza/slide";

const SwiperSlider = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(API_URL);
        setSlides(response.data);
      } catch (err) {
        console.error("Ошибка загрузки слайдов:", err);
        setError("Ошибка загрузки слайдов");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!slides.length) return <p>Нет слайдов</p>;

  return (
    <Swiper
      modules={[Navigation, EffectCoverflow, Autoplay]}
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={2}
      loop={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      lazy={{ loadPrevNext: true }}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1.5,
        slideShadows: false,
      }}
      navigation
      className={styles.slider}
      breakpoints={{
        320: { slidesPerView: 1 },
        768: { slidesPerView: 1.5 },
        1024: { slidesPerView: 2 },
        1440: { slidesPerView: 2.5 },
        1920: { slidesPerView: 3 },
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className={styles.slider__slide}>
          <img
            src={slide.imageUrl}
            alt={`Slide ${slide.id}`}
            className="swiper-lazy"
          />
          <div className="swiper-lazy-preloader"></div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;
