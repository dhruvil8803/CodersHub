module.exports = (success, status, message, res)=>{
  res.status(status).send({
    success: success,
    message: message,
  });
}