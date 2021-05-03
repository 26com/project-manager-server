function errorHandler(err, req, res, next){
    res.status(res.status || 500);
    console.log(':::Error::: ', err.message);
    res.json({
        message: err.message
    });
};

module.exports = {
    errorHandler
};