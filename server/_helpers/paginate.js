const db = require('_helpers/db');

async function paginateTicket(collection, req) {

  const pageIndex = req.query.pageIndex;
  const pageSize = req.query.pageSize;
  const sortColumn = req.query.sortColumn;
  const sortOrder = req.query.sortOrder;
  const filterColumn = req.query.filterColumn;
  const filterQuery = req.query.filterQuery;
  const role = req.auth.role;
  const isSolved = req.query.isSolved;
  const page = parseInt(pageIndex) || 0;
  const take = parseInt(pageSize) || 10;
  const skip = page * take;

  const sort = {};
  sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;

  const filter = {};
  if (isSolved === 'true') {
    filter.isSolved = { $eq: true };
  } else if (isSolved === 'false') {
    filter.isSolved = { $eq: false };
  } else {
    filter.isSolved = { $in: [true, false] };
  }
  if (role !== 'admin') {
    filter['creator.id'] = { $eq: req.auth.id };
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
  console.log(data);
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


