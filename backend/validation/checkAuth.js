import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretword123');
            req.userId = decoded.userId;
            next();
        }   catch(e) {
            return res.status(403).json({
                message: "no access user",
            });
        }
    } else {
        return res.status(403).json({
            message: "no access",
        });
    }
}