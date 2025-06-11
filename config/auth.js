// Authentication Configuration
const bcrypt = require('bcryptjs');

// Default admin credentials
// Username: faisal
// Password: faisal123 (Updated via admin panel)
const defaultUsers = [
    {
        id: 1,
        username: 'faisal',
        // This is 'faisal123' hashed
        password: '$2b$10$h5ICWpdXh/1uqzTOgvDsZ.dWy9Tqgs4Mn2DEm08ZXEehRS/5A7gIW',
        role: 'admin',
        name: 'Muhammad Faisal'
    }
];

// You can add more users here
const users = [
    ...defaultUsers,
    // Add more users like this:
    // {
    //     id: 2,
    //     username: 'yourname',
    //     password: await bcrypt.hash('yourpassword', 10),
    //     role: 'admin',
    //     name: 'Your Name'
    // }
];

// Function to find user by username
function findUserByUsername(username) {
    return users.find(user => user.username === username);
}

// Function to validate password
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

// Function to hash password (for creating new users)
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

module.exports = {
    users,
    findUserByUsername,
    validatePassword,
    hashPassword
};
