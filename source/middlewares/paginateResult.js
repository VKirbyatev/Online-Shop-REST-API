export const paginateResult = (model) => async (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  const startIndex = (page - 1) * limit;

  const results = {};

  try {
    results.results = await model
      .find({ deleted: false })
      .collation({ locale: 'en', strength: 2 })
      .sort({ name: 1, Date: 1 })
      .limit(limit)
      .skip(startIndex)
      .exec();
    results.count = await model.countDocuments({ deleted: false }).exec();
    res.paginateResult = results;
    next();
  } catch (error) {
    next(error);
  }
};
