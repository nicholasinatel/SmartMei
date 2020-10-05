const wrongQuery = `
{
  user(id: "5f79c0a7b0445044ee700ab9") {
    _id
  }
}`;
const validQuery = `
      {
        user(id: "5f79c0a7b0445044ee700ab9")
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
          borrowedBooks{
            book {
              title
            } 
            fromUser
            toUser
            lentAt
            returnedAt
          }
        }
      }
        `;

module.exports = { validQuery, wrongQuery };
