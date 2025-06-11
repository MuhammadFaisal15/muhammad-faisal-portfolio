# 🎯 Portfolio Editing Guide

## 🚀 Quick Start - How to Edit Your Website

### 📁 **File Structure Overview**
```
personal-web/
├── views/              # 📄 HTML Pages (Edit these for content)
│   ├── index.ejs      # 🏠 Homepage
│   ├── about.ejs      # 👤 About page  
│   ├── projects.ejs   # 💼 Projects page
│   ├── blog.ejs       # 📝 Blog page
│   └── contact.ejs    # 📧 Contact page
├── public/css/        # 🎨 Styling
│   └── style.css      # Main stylesheet
├── config/            # ⚙️ Configuration
│   └── site-config.js # Easy settings
└── admin.html         # 🛠️ Admin panel
```

---

## 🔧 **Easy Edits (No Coding Required)**

### 1. **Open Admin Panel**
- Open `admin.html` in your browser
- Fill out the forms with your information
- Follow the generated instructions

### 2. **Quick Text Changes**

#### **Change Your Name (Homepage)**
**File:** `views/index.ejs` - Line 66
```html
<!-- Find this line: -->
Hello, I'm an <span class="text-warning">AI Student</span>

<!-- Change to: -->
Hello, I'm an <span class="text-warning">Your Real Name</span>
```

#### **Update Your Bio**
**File:** `views/index.ejs` - Lines 68-71
```html
<!-- Replace this text with your story: -->
Passionate about exploring the fascinating world of Artificial Intelligence, 
Machine Learning, and cutting-edge technology. Welcome to my digital space!
```

#### **Add Your Email**
**File:** `views/contact.ejs` - Line ~155
```html
<!-- Find: -->
<a href="mailto:ai.student@example.com">ai.student@example.com</a>

<!-- Change to: -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
```

#### **Update Social Links**
**File:** Any page footer (Lines ~192-196)
```html
<!-- Replace # with your real links: -->
<a href="https://github.com/yourusername" class="text-light me-3">
<a href="https://linkedin.com/in/yourprofile" class="text-light me-3">
<a href="https://twitter.com/yourusername" class="text-light me-3">
```

---

## 💼 **Adding Your Real Projects**

### **File:** `views/projects.ejs`

Find the project cards (around line 70) and replace with your projects:

```html
<!-- Example project card: -->
<div class="col-lg-4 col-md-6">
    <div class="project-card">
        <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                    <i class="fas fa-chart-line me-2"></i>YOUR PROJECT NAME
                </h5>
            </div>
            <div class="card-body">
                <p class="card-text">
                    YOUR PROJECT DESCRIPTION HERE
                </p>
                <div class="mb-3">
                    <span class="badge bg-primary me-2">Python</span>
                    <span class="badge bg-secondary me-2">TensorFlow</span>
                    <span class="badge bg-info">Machine Learning</span>
                </div>
            </div>
            <div class="card-footer bg-transparent">
                <div class="d-flex justify-content-between">
                    <a href="YOUR_GITHUB_LINK" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-github me-1"></i>Code
                    </a>
                    <a href="YOUR_DEMO_LINK" class="btn btn-primary btn-sm">
                        <i class="fas fa-external-link-alt me-1"></i>Demo
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

---

## 📝 **Adding Blog Posts**

### **File:** `views/blog.ejs`

Find the blog post section (around line 80) and add your posts:

```html
<!-- Example blog post: -->
<article class="blog-post mb-5">
    <div class="card shadow-sm">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary">YOUR CATEGORY</span>
                <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>YOUR DATE
                </small>
            </div>
            <h2 class="card-title h4">
                <a href="#" class="text-decoration-none">YOUR BLOG TITLE</a>
            </h2>
            <p class="card-text">
                YOUR BLOG EXCERPT/SUMMARY HERE...
            </p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="blog-tags">
                    <span class="badge bg-secondary me-1">Tag1</span>
                    <span class="badge bg-secondary me-1">Tag2</span>
                </div>
                <a href="#" class="btn btn-outline-primary btn-sm">
                    Read More <i class="fas fa-arrow-right ms-1"></i>
                </a>
            </div>
        </div>
    </div>
</article>
```

---

## 🎨 **Customizing Colors & Design**

### **File:** `public/css/style.css`

Change the color scheme by editing the CSS variables at the top:

```css
:root {
    --primary-color: #2c3e50;     /* Main dark color */
    --secondary-color: #3498db;   /* Blue accent */
    --accent-color: #f39c12;      /* Orange/yellow accent */
    --success-color: #27ae60;     /* Green */
    --info-color: #17a2b8;        /* Light blue */
    --warning-color: #f39c12;     /* Orange */
    --danger-color: #e74c3c;      /* Red */
}
```

---

## 🔄 **How to Apply Changes**

1. **Edit the files** using any text editor (VS Code, Notepad++, etc.)
2. **Save your changes**
3. **Restart your server:**
   ```bash
   # Stop the server (Ctrl+C in terminal)
   # Then restart:
   npm start
   ```
4. **Refresh your browser** to see changes

---

## 🆘 **Common Issues & Solutions**

### **Server Won't Start**
- Check for syntax errors in your HTML
- Make sure all opening tags have closing tags
- Restart VS Code and try again

### **Changes Not Showing**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Make sure you saved the file

### **Broken Layout**
- Check for missing closing tags: `</div>`, `</section>`, etc.
- Validate your HTML structure
- Revert to a working version and try again

---

## 🎯 **Pro Tips**

1. **Make small changes** and test frequently
2. **Keep backups** of working versions
3. **Use the admin panel** for quick edits
4. **Test on mobile** by resizing your browser
5. **Ask for help** if you get stuck!

---

## 📞 **Need Help?**

- Check the browser console (F12) for errors
- Compare your changes with the original files
- Use the admin panel for guidance
- Test one change at a time

**Happy editing! 🚀**
