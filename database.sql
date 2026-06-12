-- Database Setup File for PostgreSQL

-- 1. Users Table (For Admin Accounts)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admissions Table (For Student Applications)
CREATE TABLE admissions (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    dob DATE NOT NULL,
    parent_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    studied_madrasa VARCHAR(5) NOT NULL,
    previous_institution VARCHAR(255),
    quran_level VARCHAR(50) NOT NULL,
    reading_level VARCHAR(50) NOT NULL,
    program_applied VARCHAR(100) NOT NULL,
    reason_for_joining TEXT,
    application_status VARCHAR(20) DEFAULT 'New', -- New, Under Review, Approved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Notices Table
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Upcoming Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contact Messages Table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Website Settings Table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
);

-- Insert Default Text Content for Setup
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('homepage_welcome_title', 'Welcome to Markaz Imam Ahmad bin Hanbal'),
('homepage_welcome_text', 'A leading institution dedicated to nurturing knowledge, values, and faith according to pure Islamic traditions.'),
('about_page_text', 'Markaz Imam Ahmad bin Hanbal is located in Karaparamba, Kozhikode, Kerala. We aim to offer solid foundational learning in Islamic knowledge, language arts, and character growth.'),
('contact_address', 'Karikkankulam, Karaparamba, Kozhikode, Kerala, India'),
('contact_phone', '+91 0000 000000'),
('contact_email', 'info@markazahmadbinhanbal.com'),
('hero_image_masjid', '/images/masjid.jpg'),
('hero_image_library', '/images/library.jpg'),
('hero_image_classroom', '/images/classroom.jpg'),
('hero_image_campus', '/images/campus.jpg');