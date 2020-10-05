const queryMock = function (userId1, userId2) {
  const queries = {
    user1: `
      {
        user(id: "${userId1}")
        {
          id
          name
          email
          createdAt
          collection {
            id
            title
            pages
            createdAt
          }
          lentBooks {
            book {
              title
            }
            fromUser
            toUser
            lentAt
            returnedAt
          }
          borrowedBooks{
            book {
              title
            }
            fromUser
          }
        }
      }
      `,
    user2: `
      {
        user(id: "${userId2}")
        {
          id
          name
          email
          createdAt
          collection {
            id
            title
            pages
            createdAt
          }
          lentBooks {
            book {
              title
            }
            fromUser
            toUser
            lentAt
            returnedAt
          }
          borrowedBooks{
            book {
              title
            }
            fromUser
          }
        }
      }
      `,
  };

  return queries;
};
module.exports = queryMock;
