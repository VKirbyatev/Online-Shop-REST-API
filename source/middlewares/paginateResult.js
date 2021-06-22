export const paginateResult = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  results.pages = {
    nextPage: endIndex < (await model.countDocuments().exec()) ? page + 1 : null,
    previousPage: startIndex > 0 ? page - 1 : null,
  };

  try {
    results.results = await model
      .find()
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    res.paginateResult = results;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
