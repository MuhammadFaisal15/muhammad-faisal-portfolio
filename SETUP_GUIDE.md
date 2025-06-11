# 🚀 Muhammad Faisal Portfolio - Setup Guide

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Web browser
- Text editor (VS Code recommended)

## 🛠 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Access Your Website
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login Page**: http://localhost:3000/login

## 🔐 Login Information
- **Username**: `admin`
- **Password**: `password123`

## 📁 Important Files

### Core Files
- `app.js` - Main server application
- `package.json` - Project dependencies
- `admin.html` - Admin panel interface

### Page Templates (views/)
- `index.ejs` - Homepage
- `about.ejs` - About page
- `projects.ejs` - Projects showcase
- `blog.ejs` - Blog section
- `contact.ejs` - Contact information
- `login.ejs` - Login page

### Configuration
- `config/auth.js` - Authentication settings

## 🎯 How to Use Admin Panel

### 1. Login
1. Go to http://localhost:3000/admin
2. Enter username: `admin`
3. Enter password: `password123`
4. Click "Login to Admin Panel"

### 2. Update Homepage
1. Go to "Homepage" tab
2. Enter your name and description
3. Click "Auto-Update Files"
4. Refresh your website to see changes

### 3. Update About Page
1. Go to "About" tab
2. Edit heading and paragraphs
3. Click "Auto-Update Files"
4. Changes apply immediately

### 4. Add Projects
1. Go to "Projects" tab
2. Fill in project details
3. Click "Auto-Add Project"
4. New project appears on website

### 5. Add Blog Posts
1. Go to "Blog" tab
2. Enter title, category, and content
3. Click "Auto-Add Blog Post"
4. Post appears on blog page

### 6. Update Contact Info
1. Go to "Contact" tab
2. Update email and location
3. Click "Auto-Update Files"
4. Contact page updates

### 7. Global Branding
1. Go to "Global Settings" tab
2. Update website name and branding
3. Click "Auto-Update All Files"
4. Changes apply to all pages

## 🔧 Customization

### Change Password
1. Edit `config/auth.js`
2. Generate new hash:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('your-new-password', 10);
   ```
3. Replace the password hash
4. Restart server

### Add New Users
1. Edit `config/auth.js`
2. Add new user object to users array
3. Include hashed password
4. Restart server

### Modify Styling
1. Edit CSS files in `public/css/`
2. Customize colors, fonts, layouts
3. Changes apply immediately

## 🚨 Troubleshooting

### Server Won't Start
- Check if port 3000 is available
- Run `npm install` to ensure dependencies
- Check for syntax errors in app.js

### Login Not Working
- Verify username and password
- Check server logs for errors
- Ensure bcryptjs is installed

### Auto-Update Not Working
- Check if you're logged in
- Verify server is running
- Check browser console for errors

### Pages Not Loading
- Ensure all EJS files are in views/
- Check file permissions
- Verify server is running on correct port

## 📱 Mobile Access
- Website is fully responsive
- Admin panel works on mobile
- Touch-friendly interface

## 🔒 Security Notes
- Change default password immediately
- Use HTTPS in production
- Keep dependencies updated
- Regular security audits

## 🌐 Deployment Ready
- All files are production-ready
- Environment variables supported
- Database integration ready
- Scalable architecture

## 📞 Support
If you need help:
1. Check this guide first
2. Review error messages
3. Check server logs
4. Verify all files are present

## 🎉 Enjoy Your Portfolio!
Your website is now ready to showcase your AI journey and projects to the world!
