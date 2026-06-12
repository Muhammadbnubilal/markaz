require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security Configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"]
        }
    }
}));

// Body Parsing Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Files
app.use(express.static(path.join(__dirname, 'public')));

// Configure View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Storage Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_for_markaz',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 4 // 4 Hours duration
    }
}));

// Setup Route Groups
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Error Handling Route
app.use((req, res) => {
    res.status(404).render('public/index', { 
        pageTitle: 'Page Not Found', 
        error: 'The requested link was not found.' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Application server running on port ${PORT}`);
});