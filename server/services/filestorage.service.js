async function uploadFiles(req, res) {
  try {
    console.log(req.files.filename);

    if (req.files.length <= 0) {
      return res.send('You must select at least 1 file.');
    }

    return res.send('Files has been uploaded.');
  } catch (error) {
    console.log(error);

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.send('Too many files to upload.');
    }
    return res.send(`Error when trying upload many files: ${error}`);
  }
}
// async function downloadFile(req, res) {
//   try {
//     console.log(req.params.id);
//   } catch (error) {
    
//   }
// }

module.exports = {
  uploadFiles,
};
