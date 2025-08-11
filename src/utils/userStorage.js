// Shared user storage for all authentication routes
// In production, this would be replaced with a database

let users = [];

export const addUser = (user) => {
  users.push(user);
  console.log('User added:', { id: user.id, email: user.email, firstName: user.firstName });
  return user;
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const findUserByToken = (token, tokenType = 'verificationToken') => {
  return users.find(user => user[tokenType] === token);
};

export const updateUser = (userId, updates) => {
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return null;
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