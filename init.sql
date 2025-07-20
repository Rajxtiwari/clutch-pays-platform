-- Clutch Pays Local Database Schema

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    verification_level VARCHAR(50) DEFAULT 'unverified',
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    total_matches INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    is_profile_private BOOLEAN DEFAULT false,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id),
    game_id INTEGER REFERENCES games(id),
    title VARCHAR(255) NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    stream_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'open',
    winner_id INTEGER REFERENCES users(id),
    player1_id INTEGER REFERENCES users(id),
    player2_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    match_id INTEGER REFERENCES matches(id),
    utr_id VARCHAR(100),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample games
INSERT INTO games (name, icon, is_active) VALUES
('BGMI', '🎮', true),
('Free Fire', '🔥', true),
('Call of Duty', '🎯', true),
('PUBG Mobile', '🏆', true);

-- Insert sample admin user
INSERT INTO users (email, username, name, role, verification_level, wallet_balance) VALUES
('admin@clutchpays.com', 'admin', 'Admin User', 'admin', 'host', 10000.00);

