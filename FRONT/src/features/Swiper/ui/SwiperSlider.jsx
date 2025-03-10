"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  EffectCoverflow,
  Autoplay,
  Pagination,
} from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SkeletonImage from "../../Slider/ui/skeletonImage";
import PhotoItem from "../../Slider/ui/photo-item";

// Импортируем стили Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Импортируем наши кастомные стили
import styles from "./style.module.scss";

const API_URL = "https://671e15491dfc429919813dc2.mockapi.io/reactpizza/slide";
const INITIAL_LOAD_COUNT = 5; // Количество изображений для начальной загрузки

const SwiperSlider = () => {
  const [slides, setSlides] = useState([]);
  const [loadedSlides, setLoadedSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [hasMoreSlides, setHasMoreSlides] = useState(true);

  // Загрузка начальной партии слайдов
  const fetchInitialSlides = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}?page=1&limit=${INITIAL_LOAD_COUNT}`
      );

      if (!Array.isArray(response.data) || response.data.length === 0) {
        setError("Не удалось загрузить данные");
        return;
      }

      setSlides(response.data);
      setLoadedSlides(response.data);

      // Проверяем, есть ли еще слайды для загрузки
      if (response.data.length < INITIAL_LOAD_COUNT) {
        setHasMoreSlides(false);
      }
    } catch (err) {
      console.error("Ошибка загрузки слайдов:", err);
      setError("Ошибка загрузки слайдов");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загрузка дополнительных слайдов
  const loadMoreSlides = useCallback(async () => {
    if (!hasMoreSlides) return;

    try {
      const nextPage = Math.floor(loadedSlides.length / INITIAL_LOAD_COUNT) + 1;
      const response = await axios.get(
        `${API_URL}?page=${nextPage}&limit=${INITIAL_LOAD_COUNT}`
      );

      if (!Array.isArray(response.data) || response.data.length === 0) {
        setHasMoreSlides(false);
        return;
      }

      // Добавляем только новые слайды, которых еще нет в loadedSlides
      const newSlides = response.data.filter(
        (newSlide) =>
          !loadedSlides.some((loadedSlide) => loadedSlide.id === newSlide.id)
      );

      if (newSlides.length === 0) {
        setHasMoreSlides(false);
        return;
      }

      setLoadedSlides((prev) => [...prev, ...newSlides]);
      setSlides((prev) => [...prev, ...newSlides]);

      // Если получили меньше слайдов, чем запрашивали, значит больше нет
      if (response.data.length < INITIAL_LOAD_COUNT) {
        setHasMoreSlides(false);
      }
    } catch (err) {
      console.error("Ошибка загрузки дополнительных слайдов:", err);
    }
  }, [hasMoreSlides, loadedSlides]);

  // Начальная загрузка слайдов
  useEffect(() => {
    fetchInitialSlides();
  }, [fetchInitialSlides]);

  // Загрузка дополнительных слайдов при приближении к концу
  useEffect(() => {
    if (!swiper || !hasMoreSlides) return;

    // Если пользователь приближается к концу слайдов, загружаем еще
    if (activeIndex >= loadedSlides.length - 3) {
      loadMoreSlides();
    }
  }, [activeIndex, loadedSlides.length, swiper, hasMoreSlides, loadMoreSlides]);

  // Обработчик изменения слайда
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  // Кастомные кнопки навигации
  const handlePrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const handleNext = () => {
    if (swiper) swiper.slideNext();
  };

  // Если идет загрузка, показываем скелетоны
  if (isLoading) {
    return (
      <div className={`relative ${styles.slider} h-[80%]`}>
        <div className={`${styles.slider__container} relative`}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={`${styles.skeleton_slide}`}>
              <SkeletonImage className="w-full h-full" />
            </div>
          ))}
        </div>

        {/* Показываем кнопки даже во время загрузки */}
        <button
          className={`${styles.slider__button} ${styles["slider__button--prev"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
          disabled={true}
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          className={`${styles.slider__button} ${styles["slider__button--next"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
          disabled={true}
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-100 text-red-800 p-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  // Если нет слайдов, показываем сообщение
  if (!slides.length) {
    return <p className="text-center py-10">Нет доступных слайдов</p>;
  }

  return (
    <div className={`relative ${styles.slider_wrapper}`}>
      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation, EffectCoverflow, Autoplay, Pagination]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        initialSlide={1}
        loop={true}
        speed={500}
        spaceBetween={-50} // Отрицательное значение для сближения слайдов
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 0,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          el: `.${styles.custom_pagination}`,
          bulletClass: styles.pagination_bullet,
          bulletActiveClass: styles.pagination_bullet_active,
        }}
        lazy={{
          loadPrevNext: true,
          loadPrevNextAmount: 2,
        }}
        onSlideChange={handleSlideChange}
        className={styles.custom_swiper}
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className={`${styles.custom_slide} ${
              activeIndex === slides.indexOf(slide)
                ? styles.custom_slide_active
                : ""
            }`}
          >
            <PhotoItem
              imageUrl={slide.imageUrl}
              alt={`Slide ${slide.id}`}
              className={styles.slide_image}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Кастомная пагинация */}
      <div className={styles.custom_pagination}></div>

      {/* Кастомные кнопки навигации */}
      <button
        onClick={handlePrev}
        className={`${styles.slider__button} ${styles["slider__button--prev"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      <button
        onClick={handleNext}
        className={`${styles.slider__button} ${styles["slider__button--next"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
      >
        <FiChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default SwiperSlider;
