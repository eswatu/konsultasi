const db = require('_helpers/db');

async function paginateTicket(collection, req) {
  const {
    pageIndex = 0,
    pageSize = 10,
    sortColumn = '',
    sortOrder = '',
    filterColumn = '',
    filterQuery = '',
    isSolved = '',
    auth: { role, id } = {},
  } = req.query;

  const page = parseInt(pageIndex);
  const take = parseInt(pageSize);
  const skip = page * take;

  const sort = {};
  sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;

  const filter = {};
  if (isSolved === 'true' || isSolved === 'false') {
    filter.isSolved = { $eq: isSolved === 'true' };
  } else {
    filter.isSolved = { $in: [true, false] };
  }
  if (role !== 'admin') {
    filter['creator.id'] = { $eq: id };
  }

  if (filterColumn !== 'null' && filterQuery !== 'null') {
    if (filterQuery !== "" && filterColumn !== "") {
      if (!isNaN(filterQuery)) {
        filter[filterColumn] = parseInt(filterQuery);
      } else if (filterQuery === 'true' || filterQuery === 'false') {
        filter[filterColumn] = filterQuery === 'true';
      } else {
        filter[filterColumn] = { $text: filterQuery };
      }
    }
  }

  const data = await collection
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(take)
    .exec();

  const totalCount = await collection.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / take);
  const hasPreviousPage = page > 0;
  const hasNextPage = page < totalPages - 1;

  return {
    data,
    pageIndex: page,
    pageSize: take,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    sortColumn,
    sortOrder,
    filterColumn,
    filterQuery,
  };
}

module.exports = paginateTicket;


