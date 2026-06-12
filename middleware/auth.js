module.exports = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    // Redirect to login if user is not verified
    res.redirect('/admin/login');
};