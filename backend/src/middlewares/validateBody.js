function validateBody(requiredFields = []) {
  return (req, res, next) => {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({
          error: `Falta el campo obligatorio: ${field}`,
        });
      }
    }

    next();
  };
}

export default validateBody;
