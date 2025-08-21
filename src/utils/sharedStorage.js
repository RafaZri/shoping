// Shared in-memory storage for authentication routes
// In production, this would be replaced with a database

let users = [];

export const addUser = (user) => {
  users.push(user);
  return user;
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const getAllUsers = () => {
  return users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const clearUsers = () => {
  users = [];
};

// For debugging
export const getUsersCount = () => users.length; 