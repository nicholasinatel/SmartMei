async function BookLoanFormat(lentBooks) {
  let lentBooksArray = [];
  lentBooks.forEach((elem) => {
    elem = elem.toObject();
    // Format Book Sub-Doc
    let nuBookElem = elem.book;
    nuBookElem.id = elem.book._id;
    delete nuBookElem._id;
    delete nuBookElem.__v;
    // Update Book Sub-Doc
    elem.book = nuBookElem;
    // Format LentBook Entire Doc
    let nuLentBookElem = elem;
    nuLentBookElem.id = elem._id;
    delete nuLentBookElem._id;
    delete nuLentBookElem.__v;

    lentBooksArray.push(nuLentBookElem);
  });
  return lentBooksArray;
}

module.exports = BookLoanFormat;
