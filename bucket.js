const bucket = {
  Bucket: 'madliberation-scripts',
  path2key: path => path.replace(/^madliberation-scripts[/]/, '') + '.json'
};
module.exports = bucket;