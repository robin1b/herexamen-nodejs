export const helloMiddleware = (req, res, next) => {
    console.log("Hello From Middleware");
    next();
};
