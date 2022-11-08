const jwt = require("jsonwebtoken")

exports.userAuth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            req.user = decodedToken
            if (err) {
                return res.status(401).json({ message: "Not authorized" })
            } else {
                next()
            }
        })
    } else {
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}