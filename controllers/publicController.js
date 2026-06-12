const db = require('../config/db');

// Helper to convert setting array to easily accessed object
async function getSettings() {
    const res = await db.query('SELECT setting_key, setting_value FROM site_settings');
    const settings = {};
    res.rows.forEach(row => {
        settings[row.setting_key] = row.setting_value;
    });
    return settings;
}

exports.getHome = async (req, res) => {
    try {
        const settings = await getSettings();
        const notices = await db.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 5');
        const events = await db.query('SELECT * FROM events ORDER BY event_date ASC LIMIT 5');
        res.render('public/index', { settings, notices: notices.rows, events: events.rows, activePage: 'home' });
    } catch (err) {
        res.status(500).send("Server Error Loading Homepage");
    }
};

exports.getAbout = async (req, res) => {
    try {
        const settings = await getSettings();
        res.render('public/about', { settings, activePage: 'about' });
    } catch (err) {
        res.status(500).send("Server Error Loading About Page");
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const settings = await getSettings();
        res.render('public/programs', { settings, activePage: 'programs' });
    } catch (err) {
        res.status(500).send("Server Error Loading Programs Page");
    }
};

exports.getFacilities = async (req, res) => {
    try {
        const settings = await getSettings();
        res.render('public/facilities', { settings, activePage: 'facilities' });
    } catch (err) {
        res.status(500).send("Server Error Loading Facilities Page");
    }
};

exports.getAdmission = async (req, res) => {
    try {
        const settings = await getSettings();
        res.render('public/admission', { settings, activePage: 'admission', successMessage: null });
    } catch (err) {
        res.status(500).send("Server Error Loading Admission Page");
    }
};

exports.postAdmission = async (req, res) => {
    try {
        const settings = await getSettings();
        const { 
            full_name, dob, parent_name, phone_number, address, 
            studied_madrasa, previous_institution, quran_level, 
            reading_level, program_applied, reason_for_joining 
        } = req.body;

        const queryText = `INSERT INTO admissions 
            (full_name, dob, parent_name, phone_number, address, studied_madrasa, previous_institution, quran_level, reading_level, program_applied, reason_for_joining) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
        
        await db.query(queryText, [
            full_name, dob, parent_name, phone_number, address, 
            studied_madrasa, previous_institution, quran_level, 
            reading_level, program_applied, reason_for_joining
        ]);

        res.render('public/admission', { 
            settings, 
            activePage: 'admission', 
            successMessage: "Your application has been received. We will contact you soon." 
        });
    } catch (err) {
        res.status(500).send("Error submitting application form.");
    }
};

exports.getContact = async (req, res) => {
    try {
        const settings = await getSettings();
        res.render('public/contact', { settings, activePage: 'contact', successMessage: null });
    } catch (err) {
        res.status(500).send("Server Error Loading Contact Page");
    }
};

exports.postContact = async (req, res) => {
    try {
        const settings = await getSettings();
        const { name, phone, email, message } = req.body;

        await db.query(
            'INSERT INTO contact_messages (name, phone, email, message) VALUES ($1, $2, $3, $4)',
            [name, phone, email, message]
        );

        res.render('public/contact', { 
            settings, 
            activePage: 'contact', 
            successMessage: "Thank you for reaching out. Your message has been safely received." 
        });
    } catch (err) {
        res.status(500).send("Error saving message.");
    }
};