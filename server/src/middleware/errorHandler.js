const errorHandler = (err, req, res, next) => {
    const message = `ERROR: ${err.message}`;
    res.status(500).send(message);
}

export { errorHandler };