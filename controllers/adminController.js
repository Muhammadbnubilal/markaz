const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
    if (req.session.isAdmin) return res.redirect('/admin/dashboard');
    res.render('admin/login', { errorMessage: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                req.session.isAdmin = true;
                req.session.username = user.username;
                return res.redirect('/admin/dashboard');
            }
        }
        res.render('admin/login', { errorMessage: 'Invalid username or password configuration.' });
    } catch (err) {
        res.status(500).send("Internal login verification error.");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
};

exports.getDashboard = async (req, res) => {
    try {
        const appsCount = await db.query('SELECT COUNT(*) FROM admissions');
        const noticesCount = await db.query('SELECT COUNT(*) FROM notices');
        const eventsCount = await db.query('SELECT COUNT(*) FROM events');
        const messagesCount = await db.query('SELECT COUNT(*) FROM contact_messages');

        res.render('admin/dashboard', {
            stats: {
                applications: appsCount.rows[0].count,
                notices: noticesCount.rows[0].count,
                events: eventsCount.rows[0].count,
                messages: messagesCount.rows[0].count
            }
        });
    } catch (err) {
        res.status(500).send("Dashboard load failure");
    }
};

// Application Management Process
exports.getApplications = async (req, res) => {
    const search = req.query.search || '';
    try {
        let result;
        if (search) {
            result = await db.query(
                "SELECT * FROM admissions WHERE full_name ILIKE $1 OR phone_number ILIKE $1 ORDER BY created_at DESC",
                [`%${search}%`]
            );
        } else {
            result = await db.query("SELECT * FROM admissions ORDER BY created_at DESC");
        }
        res.render('admin/applications', { applications: result.rows, search });
    } catch (err) {
        res.status(500).send("Error reading application list.");
    }
};

exports.updateApplicationStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        await db.query("UPDATE admissions SET application_status = $1 WHERE id = $2", [status, id]);
        res.redirect('/admin/applications');
    } catch (err) {
        res.status(500).send("Error altering application state.");
    }
};

exports.deleteApplication = async (req, res) => {
    const { id } = req.body;
    try {
        await db.query("DELETE FROM admissions WHERE id = $1", [id]);
        res.redirect('/admin/applications');
    } catch (err) {
        res.status(500).send("Error removing application record.");
    }
};

// Notice Management Process
exports.getNotices = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM notices ORDER BY created_at DESC");
        res.render('admin/notices', { notices: result.rows });
    } catch (err) {
        res.status(500).send("Error fetching notices.");
    }
};

exports.addNotice = async (req, res) => {
    const { title, content } = req.body;
    try {
        await db.query("INSERT INTO notices (title, content) VALUES ($1, $2)", [title, content]);
        res.redirect('/admin/notices');
    } catch (err) {
        res.status(500).send("Error writing notice entry.");
    }
};

exports.editNotice = async (req, res) => {
    const { id, title, content } = req.body;
    try {
        await db.query("UPDATE notices SET title = $1, content = $2 WHERE id = $3", [title, content, id]);
        res.redirect('/admin/notices');
    } catch (err) {
        res.status(500).send("Error updating notice entry.");
    }
};

exports.deleteNotice = async (req, res) => {
    const { id } = req.body;
    try {
        await db.query("DELETE FROM notices WHERE id = $1", [id]);
        res.redirect('/admin/notices');
    } catch (err) {
        res.status(500).send("Error removing notice entry.");
    }
};

// Event Management Process
exports.getEvents = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM events ORDER BY event_date ASC");
        res.render('admin/events', { events: result.rows });
    } catch (err) {
        res.status(500).send("Error viewing calendar list.");
    }
};

exports.addEvent = async (req, res) => {
    const { title, event_date, description } = req.body;
    try {
        await db.query("INSERT INTO events (title, event_date, description) VALUES ($1, $2, $3)", [title, event_date, description]);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send("Error building item record.");
    }
};

exports.editEvent = async (req, res) => {
    const { id, title, event_date, description } = req.body;
    try {
        await db.query("UPDATE events SET title = $1, event_date = $2, description = $3 WHERE id = $4", [title, event_date, description, id]);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send("Error rewriting event item.");
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.body;
    try {
        await db.query("DELETE FROM events WHERE id = $1", [id]);
        res.redirect('/admin/events');
    } catch (err) {
        res.status(500).send("Error discarding event log.");
    }
};

// Website Settings Process
exports.getSettings = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM site_settings');
        const settings = {};
        result.rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
        res.render('admin/settings', { settings });
    } catch (err) {
        res.status(500).send("Error accessing page parameters.");
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        for (let key of keys) {
            await db.query("UPDATE site_settings SET setting_value = $1 WHERE setting_key = $2", [req.body[key], key]);
        }
        res.redirect('/admin/settings');
    } catch (err) {
        res.status(500).send("Error writing dynamic adjustments.");
    }
};

// Messages Process
exports.getMessages = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        res.render('admin/messages', { messages: result.rows });
    } catch (err) {
        res.status(500).send("Error sorting contact logs.");
    }
};