async function BookFormat(book) {
  let booksArray = [];
  book.forEach((elem) => {
    const nuBookElem = {
      id: elem._id,
      title: elem.title,
      pages: elem.pages,
      createdAt: elem.createdAt,
    };
    booksArray.push(nuBookElem);
  });
  return booksArray;
}

module.exports = BookFormat;
