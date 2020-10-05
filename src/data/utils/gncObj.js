function format(obj) {
  let fmtObj = obj.toObject();
  fmtObj.id = obj._id;
  delete fmtObj._id;
  delete fmtObj.__v;
  return fmtObj;
}

module.exports = format;
