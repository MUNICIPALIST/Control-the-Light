import React from "react";
import styles from "../ui/style.module.scss";

import { PRODUCT_CATEGORIES } from "../model/constants/categories";

const ProductCategories = () => {
    return (
        <section className={styles.showcase}>
            <h2 className={styles.title}>
                СОБСТВЕННОЕ ПРОИЗВОДСТВО ШТОР В САНКТ-ПЕТЕРБУРГЕ И МОСКВЕ
            </h2>
            <div className={styles.categories}>
                {PRODUCT_CATEGORIES.map((category) => (
                    <div key={category.id} className={styles.category}>
                        <img
                            src={category.iconUrl || "/placeholder.svg"}
                            alt={category.alt}
                            className={styles.icon}
                        />
                        <span className={styles.categoryTitle}>
                            {category.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductCategories;
