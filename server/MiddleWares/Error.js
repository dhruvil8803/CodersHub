module.exports = (func) => (req, res, next) =>{
    Promise.resolve(func(req, res, next)).catch((e)=>{
        res.status(404).send({
            success: false,
            message: e.message,
        })
    })
}