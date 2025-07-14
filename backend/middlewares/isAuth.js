export const isAuth = (req, res, next) => {
    if(req.session.auth) {
        next();
    }
    else {
        res.send("Failed");
    }
}