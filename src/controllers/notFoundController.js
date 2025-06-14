export const notFound = (req, res) => {
    res.status(404).json({
        message: `The requested endpoint doesn't exist.`,
        method: req.method,
        endpoint: req.originalUrl,
    });
};
