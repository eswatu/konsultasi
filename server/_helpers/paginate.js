// const db = require('_helpers/db');
/**
 * Paginates the ticket collection based on the provided query.
 *
 * @param {Object} collection - The collection to paginate.
 * @param {Object} query - The query object containing pagination parameters and filters.
 * @returns {Object} An object containing the paginated data and metadata.
 */
async function paginateTicket(collection, query, _auth) {
  // Destructure query object
  const {
    pageIndex = 0, // Default page index is 0
    pageSize = 10, // Default page size is 10
    sortColumn = '', // Default sort column is empty string
    sortOrder = '', // Default sort order is empty string
    filterColumn = '', // Default filter column is empty string
    filterQuery = '', // Default filter query is empty string
    isSolved = '', // Default isSolved is empty string
  } = query;
  const { role, id } = _auth;

  const page = parseInt(pageIndex, 10); // Convert page index to integer
  const take = parseInt(pageSize, 10); // Convert page size to integer
  const skip = page * take; // Calculate number of documents to skip

  const sort = {};
  sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1; // Set sort order

  const filter = {};
  if (isSolved === 'true' || isSolved === 'false') {
    // If isSolved is 'true' or 'false'
    filter.isSolved = { $eq: isSolved === 'true' }; // Set filter for isSolved
  } else {
    filter.isSolved = { $in: [true, false] }; // Set filter for isSolved with values true and false
  }
  if (role === 'Client') {
    filter['creator.id'] = { $in: [id, 'server'] }; // Set filter for creator id if role is Client
  }
  if (filterColumn !== 'null' && filterQuery !== 'null') {
    // If filterColumn and filterQuery are not 'null'
    if (filterQuery !== '' && filterColumn !== '') {
      // If filterQuery and filterColumn are not empty
      if (!Number.isNaN(filterQuery)) {
        filter[filterColumn] = parseInt(filterQuery, 10); // Set filter for numeric values
      } else if (filterQuery === 'true' || filterQuery === 'false') {
        filter[filterColumn] = filterQuery === 'true'; // Set filter for boolean values
      } else {
        const regex = new RegExp(filterQuery, 'i');
        filter[filterColumn] = { $regex: regex }; // Set filter for text search
      }
    }
  }

  // Execute query with pagination parameters
  const data = await collection
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(take)
    .exec();

  // Get total count of documents matching the filter
  const totalCount = await collection.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / take); // Calculate total number of pages
  const hasPreviousPage = page > 0; // Check if there is a previous page
  const hasNextPage = page < totalPages - 1; // Check if there is a next page
  // console.log('id query ' + id);
  // console.log(data);
  // Return paginated data and metadata
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
async function paginateUser(collection, query) {
  // Destructure query object
  const {
    pageIndex = 0, // Default page index is 0
    pageSize = 10, // Default page size is 10
    sortColumn = '', // Default sort column is empty string
    sortOrder = '', // Default sort order is empty string
    filterColumn = '', // Default filter column is empty string
    filterQuery = '', // Default filter query is empty string
  } = query;

  const page = parseInt(pageIndex, 10); // Convert page index to integer
  const take = parseInt(pageSize, 10); // Convert page size to integer
  const skip = page * take; // Calculate number of documents to skip

  const sort = {};
  sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1; // Set sort order

  const filter = {};

  if (filterColumn !== 'null' && filterQuery !== 'null') {
    // If filterColumn and filterQuery are not 'null'
    if (filterQuery !== '' && filterColumn !== '') {
      // If filterQuery and filterColumn are not empty
      if (!Number.isNaN(filterQuery)) {
        filter[filterColumn] = parseInt(filterQuery, 10); // Set filter for numeric values
      } else if (filterQuery === 'true' || filterQuery === 'false') {
        filter[filterColumn] = filterQuery === 'true'; // Set filter for boolean values
      } else {
        const regex = new RegExp(filterQuery, 'i');
        filter[filterColumn] = { $regex: regex }; // Set filter for text search
      }
    }
  }

  // Execute query with pagination parameters
  const data = await collection
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(take)
    .exec();

  // Get total count of documents matching the filter
  const totalCount = await collection.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / take); // Calculate total number of pages
  const hasPreviousPage = page > 0; // Check if there is a previous page
  const hasNextPage = page < totalPages - 1; // Check if there is a next page

  // Return paginated data and metadata
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

module.exports = { paginateTicket, paginateUser };
