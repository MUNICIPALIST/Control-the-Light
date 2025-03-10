"use client";

import { useState, useEffect, useRef } from "react";
import SkeletonImage from "./skeletonImage";

// Кэш для уже загруженных изображений
const imageCache = new Map();

const PhotoItem = ({ imageUrl, alt, className }) => {
  const [isLoading, setIsLoading] = useState(!imageCache.has(imageUrl));
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  // Немедленно начинаем загрузку изображения при монтировании компонента
  useEffect(() => {
    // Если URL не предоставлен, показываем скелетон
    if (!imageUrl) {
      return;
    }

    // Если изображение уже в кэше, не загружаем его снова
    if (imageCache.has(imageUrl)) {
      setIsLoading(false);
      return;
    }

    // Загружаем изображение
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      // Добавляем в кэш
      imageCache.set(imageUrl, true);

      // Обновляем состояние только если компонент все еще смонтирован
      if (mountedRef.current) {
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      if (mountedRef.current) {
        setIsLoading(false);
        setError(true);
      }
    };

    // Очистка при размонтировании
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // Очистка при размонтировании компонента
  // Мы НЕ используем здесь mountedRef.current = false, так как это вызывает проблемы

  if (!imageUrl) {
    return <SkeletonImage className={className} />;
  }

  if (isLoading) {
    return <SkeletonImage className={className} />;
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
      >
        <span className="text-red-500">Ошибка загрузки</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || "Изображение"}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
};

export default PhotoItem;
