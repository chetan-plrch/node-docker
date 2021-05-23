const protect = (req, res, next) => {
    if(req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        return res.status(401).json({
            status: 'fail',
            error: 'unauthorized'
        })
    }
}

module.exports = {
    protect
}