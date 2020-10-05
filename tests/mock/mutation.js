const mock = function (userId1, userId2) {
  const mutations = {
    createUser1: `
  mutation {
    createUser(input: {
      name: "yoda",
      email: "yoda@republic.com"
    }) {
        name
          email
          id
          createdAt
      }
  }
`,
    createUser2: `
mutation {
  createUser(input: {
    name: "Darth Sidious",
    email: "palpatine@sith.net"
  }) {
      name
        email
        id
        createdAt
    }
}
`,
    addBook1ToMyCollection: `
mutation {
  addBookToMyCollection(
    loggedUserId: "${userId1}"
    input: { title: "1001 Discos para Ouvir", pages: 1001 }
  ) {
    title
    pages
    id
    createdAt
  }
}
`,
    addBook2ToMyCollection: `
mutation {
  addBookToMyCollection(
    loggedUserId: "${userId1}"
    input: { title: "Lord Of The Rings", pages: 500 }
  ) {
    title
    pages
    id
    createdAt
  }
}
`,

    addBook3ToMyCollection: `
mutation {
  addBookToMyCollection(
    loggedUserId: "${userId1}"
    input: { title: "Unfuck Yourself", pages: 100 }
  ) {
    title
    pages
    id
    createdAt
  }
}
`,

    addBook4ToMyCollection: `
mutation {
  addBookToMyCollection(
    loggedUserId: "${userId2}"
    input: { title: "As 5 Linguagens do Amor", pages: 100 }
  ) {
    title
    pages
    id
    createdAt
  }
}
`,
  };

  return mutations;
};

module.exports = mock;
