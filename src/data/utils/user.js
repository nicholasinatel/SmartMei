async function UserFormat(user, collection, lentBooks, borrowedBooks) {
  const result = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    collection: collection,
    lentBooks: lentBooks,
    borrowedBooks: borrowedBooks,
  };
  return result;
}

module.exports = UserFormat;
