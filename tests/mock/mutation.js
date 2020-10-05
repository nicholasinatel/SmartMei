const mutations = {
  createUser: `
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
};

module.exports = mutations;
