CREATE TABLE IF NOT EXISTS banners (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_banners_cloudinary_public_id (cloudinary_public_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;