
// export async function paginateTicket(collection:any, query, _auth) {
//   // Destructure query object
//   const {
//     pageIndex = 0, // Default page index is 0
//     pageSize = 10, // Default page size is 10
//     sortColumn = '', // Default sort column is empty string
//     sortOrder = '', // Default sort order is empty string
//     filterColumn = '', // Default filter column is empty string
//     filterQuery = '', // Default filter query is empty string
//     filterSDate = 'null', // Default null
//     filterEDate = 'null', // Default null
//   } = query;
//   const { role, id } = _auth;

//   const page = parseInt(pageIndex, 10); // Convert page index to integer
//   const take = parseInt(pageSize, 10); // Convert page size to integer
//   const skip = page * take; // Calculate number of documents to skip

//   const sort = {};
//   sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1; // Set sort order

//   const filter = {};
//   if (role === 'Client') {
//     filter['creator.id'] = { $in: [id, 'server'] }; // Set filter for creator id if role is Client
//   }
//   if (filterSDate !== 'null' && filterEDate !== 'null') {
//     const start = filterSDate.split('-');
//     const end = filterEDate.split('-');
//     filter.createdAt = {
//       $gte: Date(start[2], start[1], start[0]),
//       $lte: Date(end[2], end[1], end[0]),
//     };
//   }
//   if (filterColumn !== 'null' && filterQuery !== 'null') {
//     // If filterColumn and filterQuery are not 'null'
//     if (filterQuery !== '' && filterColumn !== '') {
//       // If filterQuery and filterColumn are not empty
//       if (!Number.isNaN(filterQuery)) {
//         filter[filterColumn] = parseInt(filterQuery, 10); // Set filter for numeric values
//       } else if (filterQuery === 'true' || filterQuery === 'false') {
//         filter[filterColumn] = filterQuery === 'true'; // Set filter for boolean values
//       } else {
//         const regex = new RegExp(filterQuery, 'i');
//         filter[filterColumn] = { $regex: regex }; // Set filter for text search
//       }
//     }
//   }

//   // Execute query with pagination parameters
//   const data = await collection
//     .find(filter)
//     .sort(sort)
//     .skip(skip)
//     .limit(take)
//     .exec();

//   // Get total count of documents matching the filter
//   const totalCount = await collection.countDocuments(filter);
//   const totalPages = Math.ceil(totalCount / take); // Calculate total number of pages
//   const hasPreviousPage = page > 0; // Check if there is a previous page
//   const hasNextPage = page < totalPages - 1; // Check if there is a next page
//   // console.log('id query ' + id);
//   // console.log(data);
//   // Return paginated data and metadata
//   return {
//     data,
//     pageIndex: page,
//     pageSize: take,
//     totalCount,
//     totalPages,
//     hasPreviousPage,
//     hasNextPage,
//     sortColumn,
//     sortOrder,
//     filterColumn,
//     filterQuery,
//   };
// }
// async function paginateUser(collection, query) {
//   // Destructure query object
//   const {
//     pageIndex = 0, // Default page index is 0
//     pageSize = 10, // Default page size is 10
//     sortColumn = '', // Default sort column is empty string
//     sortOrder = '', // Default sort order is empty string
//     filterColumn = '', // Default filter column is empty string
//     filterQuery = '', // Default filter query is empty string
//   } = query;

//   const page = parseInt(pageIndex, 10); // Convert page index to integer
//   const take = parseInt(pageSize, 10); // Convert page size to integer
//   const skip = page * take; // Calculate number of documents to skip

//   const sort = {};
//   sort[sortColumn] = sortOrder.toUpperCase() === 'DESC' ? -1 : 1; // Set sort order

//   const filter = {};

//   if (filterColumn !== 'null' && filterQuery !== 'null') {
//     // If filterColumn and filterQuery are not 'null'
//     if (filterQuery !== '' && filterColumn !== '') {
//       // If filterQuery and filterColumn are not empty
//       if (!Number.isNaN(filterQuery)) {
//         filter[filterColumn] = parseInt(filterQuery, 10); // Set filter for numeric values
//       } else if (filterQuery === 'true' || filterQuery === 'false') {
//         filter[filterColumn] = filterQuery === 'true'; // Set filter for boolean values
//       } else {
//         const regex = new RegExp(filterQuery, 'i');
//         filter[filterColumn] = { $regex: regex }; // Set filter for text search
//       }
//     }
//   }

//   // Execute query with pagination parameters
//   const data = await collection
//     .find(filter)
//     .sort(sort)
//     .skip(skip)
//     .limit(take)
//     .exec();

//   // Get total count of documents matching the filter
//   const totalCount = await collection.countDocuments(filter);
//   const totalPages = Math.ceil(totalCount / take); // Calculate total number of pages
//   const hasPreviousPage = page > 0; // Check if there is a previous page
//   const hasNextPage = page < totalPages - 1; // Check if there is a next page

//   // Return paginated data and metadata
//   return {
//     data,
//     pageIndex: page,
//     pageSize: take,
//     totalCount,
//     totalPages,
//     hasPreviousPage,
//     hasNextPage,
//     sortColumn,
//     sortOrder,
//     filterColumn,
//     filterQuery,
//   };
// }

// module.exports = { paginateTicket, paginateUser };
