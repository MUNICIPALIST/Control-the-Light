import { useState, useEffect, useCallback } from "react";
import data from "../../../shared/assets/data.json";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import styles from "./style.module.scss";

const Slider = () => {
    const [people] = useState(data);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationDirection, setAnimationDirection] = useState(null);

    const changeSlide = useCallback(
        (direction) => {
            if (isAnimating) return;
            setIsAnimating(true);
            setAnimationDirection(direction === "next" ? "left" : "right");

            const newIndex =
                direction === "next"
                    ? (currentIndex + 1) % people.length
                    : (currentIndex - 1 + people.length) % people.length;

            setTimeout(() => {
                setCurrentIndex(newIndex);
                setIsAnimating(false);
                setAnimationDirection(null);
            }, 500);
        },
        [currentIndex, isAnimating, people.length]
    );

    useEffect(() => {
        const slider = setInterval(() => {
            changeSlide("next");
        }, 5000);
        return () => clearInterval(slider);
    }, [changeSlide]);

    const getVisibleSlides = useCallback(() => {
        const slides = [];
        const lastIndex = people.length - 1;

        const prevIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        const nextIndex = (currentIndex + 1) % people.length;
        const afterNextIndex = (currentIndex + 2) % people.length;
        const prevPrevIndex =
            (currentIndex - 2 + people.length) % people.length;

        slides.push({ ...people[prevIndex], position: "prev" });
        slides.push({ ...people[currentIndex], position: "active" });
        slides.push({ ...people[nextIndex], position: "next" });
        slides.push({ ...people[afterNextIndex], position: "afterNext" });
        slides.push({ ...people[prevPrevIndex], position: "prevPrev" });

        return slides;
    }, [currentIndex, people]);

    return (
        <div className={`relative ${styles.slider} h-[80%]`}>
            <div className={`${styles.slider__container} relative`}>
                {getVisibleSlides().map((person) => {
                    const { id, image, position } = person;

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
                            key={id}
                            className={`${styles.slider__slide} ${
                                styles[`slider__slide--${position}`]
                            }`}
                            style={slideStyle}
                        >
                            <div className="">
                                <img
                                    src={image || "/placeholder.svg"}
                                    className={`${styles.slider__image} mx-auto`}
                                    alt="Slide"
                                />
                            </div>
                        </article>
                    );
                })}
            </div>
            <button
                className={`${styles.slider__button} ${styles["slider__button--prev"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
                onClick={() => changeSlide("prev")}
            >
                <FiChevronLeft className="text-2xl" />
            </button>
            <button
                className={`${styles.slider__button} ${styles["slider__button--next"]} bg-amber-700 text-white flex items-center justify-center rounded-full shadow-md hover:bg-amber-600 transition-colors`}
                onClick={() => changeSlide("next")}
            >
                <FiChevronRight className="text-2xl" />
            </button>
        </div>
    );
};

export default Slider;
