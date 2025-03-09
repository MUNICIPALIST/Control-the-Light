import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PhotoItem from "./photo-item";
import SkeletonImage from "./skeletonImage";
import styles from "./style.module.scss";

const API_URL = "https://671e15491dfc429919813dc2.mockapi.io/reactpizza/slide";

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка слайдов при инициализации
  useEffect(() => {
    let isMounted = true;

    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL);

        if (!isMounted) return;

        if (!Array.isArray(response.data) || response.data.length === 0) {
          setError("Не удалось загрузить данные");
          setIsLoading(false);
          return;
        }

        setTotalSlides(response.data.length);
        setSlides(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки слайдов:", err);
        if (isMounted) {
          setError("Ошибка загрузки слайдов");
          setIsLoading(false);
        }
      }
    };

    fetchSlides();

    // Используем локальную переменную для очистки
    return () => {
      isMounted = false;
    };
  }, []);

  // Функция для смены слайда
  const changeSlide = useCallback(
    (direction) => {
      if (isAnimating || slides.length < 2) return;

      setIsAnimating(true);
      setAnimationDirection(direction === "next" ? "left" : "right");

      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % totalSlides
          : (currentIndex - 1 + totalSlides) % totalSlides;

      setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 500);
    },
    [currentIndex, isAnimating, slides.length, totalSlides]
  );

  // Автоматическая смена слайдов
  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(() => {
      changeSlide("next");
    }, 5000);

    return () => clearInterval(timer);
  }, [changeSlide, slides.length]);

  // Получение видимых слайдов
  const getVisibleSlides = useCallback(() => {
    if (slides.length === 0) return [];

    const visibleSlides = [];
    const lastIndex = totalSlides - 1;

    const prevIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    const nextIndex = (currentIndex + 1) % totalSlides;
    const afterNextIndex = (currentIndex + 2) % totalSlides;
    const prevPrevIndex = (currentIndex - 2 + totalSlides) % totalSlides;

    // Создаем объекты для всех позиций слайдов
    const positions = [
      { id: prevPrevIndex, position: "prevPrev" },
      { id: prevIndex, position: "prev" },
      { id: currentIndex, position: "active" },
      { id: nextIndex, position: "next" },
      { id: afterNextIndex, position: "afterNext" },
    ];

    // Для каждой позиции находим соответствующий слайд
    positions.forEach(({ id, position }) => {
      const slide = slides.find((s) => Number(s.id) === Number(id));
      if (slide) {
        visibleSlides.push({ ...slide, position });
      }
    });

    return visibleSlides;
  }, [currentIndex, slides, totalSlides]);

  // Получаем видимые слайды
  const visibleSlides = getVisibleSlides();

  // Немедленно запускаем загрузку всех изображений - ПЕРЕМЕЩЕНО СЮДА
  useEffect(() => {
    if (visibleSlides.length > 0) {
      visibleSlides.forEach((slide) => {
        const img = new Image();
        img.src = slide.imageUrl;
      });
    }
  }, [visibleSlides]);

  // Если идет загрузка, показываем скелетоны для всех позиций
  if (isLoading) {
    return (
      <div className={`relative ${styles.slider} h-[80%]`}>
        <div className={`${styles.slider__container} relative`}>
          {/* Показываем скелетоны для всех позиций */}
          {["prevPrev", "prev", "active", "next", "afterNext"].map(
            (position) => (
              <article
                key={position}
                className={`${styles.slider__slide} ${
                  styles[`slider__slide--${position}`]
                }`}
              >
                <div className="w-full h-full">
                  <SkeletonImage className="w-full h-full" />
                </div>
              </article>
            )
          )}
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

  return (
    <div className={`relative ${styles.slider} h-[80%]`}>
      <div className={`${styles.slider__container} relative`}>
        {visibleSlides.map((slide) => {
          const { id, imageUrl, position } = slide;

          let slideStyle = {};
          if (isAnimating) {
            if (animationDirection === "left") {
              if (position === "active")
                slideStyle = {
                  animation: `${styles.slideCenterToLeft} 0.5s ease-in-out forwards`,
                };
              else if (position === "next")
                slideStyle = {
                  animation: `${styles.slideLeftToCenter} 0.5s ease-in-out forwards`,
                };
              else if (position === "prev")
                slideStyle = {
                  animation: `${styles.slidePrevToLeft} 0.5s ease-in-out forwards`,
                };
              else if (position === "afterNext")
                slideStyle = {
                  animation: `${styles.slideRightToNext} 0.5s ease-in-out forwards`,
                };
            } else if (animationDirection === "right") {
              if (position === "active")
                slideStyle = {
                  animation: `${styles.slideCenterToRight} 0.5s ease-in-out forwards`,
                };
              else if (position === "prev")
                slideStyle = {
                  animation: `${styles.slideRightToCenter} 0.5s ease-in-out forwards`,
                };
              else if (position === "next")
                slideStyle = {
                  animation: `${styles.slideNextToRight} 0.5s ease-in-out forwards`,
                };
              else if (position === "afterNext")
                slideStyle = {
                  animation: `${styles.slideAfterNextToRight} 0.5s ease-in-out forwards`,
                };
              else if (position === "prevPrev")
                slideStyle = {
                  animation: `${styles.slidePrevPrevToRight} 0.5s ease-in-out forwards`,
                };
            }
          }

          return (
            <article
              key={`${id}-${position}`}
              className={`${styles.slider__slide} ${
                styles[`slider__slide--${position}`]
              }`}
              style={slideStyle}
            >
              <div className="w-full h-full">
                <PhotoItem
                  key={imageUrl}
                  imageUrl={imageUrl}
                  alt={`Slide ${id}`}
                  className={`${styles.slider__image} mx-auto w-full h-full`}
                />
              </div>
            </article>
          );
        })}
      </div>

      <button
        className={`${styles.slider__button} ${styles["slider__button--prev"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
        onClick={() => changeSlide("prev")}
        disabled={isAnimating}
      >
        <FiChevronLeft className="text-2xl" />
      </button>
      <button
        className={`${styles.slider__button} ${styles["slider__button--next"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
        onClick={() => changeSlide("next")}
        disabled={isAnimating}
      >
        <FiChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default Slider;
