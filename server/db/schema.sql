-- ========================================
-- Posts Table
-- Stores user-created blog posts
-- ========================================

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    content TEXT NOT NULL,

    tag VARCHAR(100),

    mood VARCHAR(50),

    author VARCHAR(255) NOT NULL,

    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- Comments Table
-- Stores comments connected to real database posts
-- ========================================

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,

    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    author VARCHAR(255) NOT NULL,

    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);