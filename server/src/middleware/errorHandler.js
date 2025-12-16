const errorHandler = (err, req, res, next) => {
    const message = err.message || 'An error occurred';
    res.status(500).json({ error: message });
}

export { errorHandler };