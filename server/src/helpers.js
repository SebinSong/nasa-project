const DEFAULT_PAGE_LIMIT = 0 // if 0 is passed to the Query.limit() of mongoose, it returns all docs.

function getPagination (query) {
  // turn request.query into { skip, limit } object.
  const page = query.page ? Math.abs(query.page) : 1
  const limit = query.limit ? Math.abs(query.limit) : DEFAULT_PAGE_LIMIT

  return { skip: (page - 1) * limit, limit }
}

module.exports = {
  getPagination
}
