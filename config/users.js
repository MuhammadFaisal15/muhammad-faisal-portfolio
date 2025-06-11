// User Database Configuration
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Simple file-based user storage
const usersFilePath = path.join(__dirname, 'users.json');

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

// Load users from file
function loadUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

// Save users to file
function saveUsers(users) {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

// Find user by username
function findRegularUser(username) {
    const users = loadUsers();
    return users.find(user => user.username === username);
}

// Find user by email
function findUserByEmail(email) {
    const users = loadUsers();
    return users.find(user => user.email === email);
}

// Create new user
function createRegularUser(userData) {
    const users = loadUsers();
    
    // Generate new ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser = {
        id: newId,
        fullName: userData.fullName,
        username: userData.username,
        email: userData.email,
        password: userData.password, // Should already be hashed
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    users.push(newUser);
    
    if (saveUsers(users)) {
        return newUser;
    } else {
        throw new Error('Failed to save user');
    }
}

// Update user
function updateUser(userId, updateData) {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
        return null;
    }
    
    users[userIndex] = { ...users[userIndex], ...updateData };
    
    if (saveUsers(users)) {
        return users[userIndex];
    } else {
        throw new Error('Failed to update user');
    }
}

// Delete user
function deleteUser(userId) {
    const users = loadUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length === users.length) {
        return false; // User not found
    }
    
    return saveUsers(filteredUsers);
}

// Get all users
function getAllUsers() {
    return loadUsers();
}

// Hash password
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Validate password
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    findRegularUser,
    findUserByEmail,
    createRegularUser,
    updateUser,
    deleteUser,
    getAllUsers,
    hashPassword,
    validatePassword
};
