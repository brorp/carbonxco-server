const error = (err, req, res, next) => {
    console.log('====================================');
    console.log(err);
    console.log('====================================');
    if (err.code && err.code != 500) {
      res.status(err.code).json({
        status: err.code,
        message: err.message.original,
      });
    } else if (err.name === 'SequelizeValidationError') {
      let message = '';
      for (let field in err.errors) {
        message = err.errors[field].message;
      }
      res.status(400).json({
        status: 400,
        message,
      });
    } else if (err.name === 'SequelizeDatabaseError') {
      let message = err.original;
      for (let field in err.errors) {
        message = err.errors[field].message;
      }
      res.status(400).json({
        status: 400,
        message,
      });
    } else if (err.name === 'invalidtoken') {
      res.status(401).json({
        status: 401,
        message: 'Invalid Token',
      });
    } else if(err.name === 'ParameterMissingError'){
      res.status(400).json({
        status: 400,
        message: err.message
      })
    } else {
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  };

module.exports = error
  