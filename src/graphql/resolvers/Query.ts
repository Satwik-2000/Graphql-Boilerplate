import { getUserDetails } from "../../resolvers/User.query";

const Query = {
  InitQuery: () => {
    return "Query Initialized";
  },
  // User
  getUserDetails
};

export default Query;
