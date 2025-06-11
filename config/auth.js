// Authentication Configuration
const bcrypt = require('bcryptjs');

// Default admin credentials
// Username: admin
// Password: admin123 (SIMPLE PASSWORD FOR TESTING)
const defaultUsers = [
    {
        id: 1,
        username: 'admin',
        // This is 'admin123' hashed - SIMPLE PASSWORD!
        password: '$2b$10$X9pEMomjUEhsW45B/iPm0uBUkMgnns45de2fB.jiVouDUtrvTprzS',
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
