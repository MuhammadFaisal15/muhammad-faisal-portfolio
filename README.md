# 🤖 AI Student Portfolio Website

A modern, responsive portfolio website built with Node.js and Express, designed specifically for AI students and professionals to showcase their projects, blog about their learning journey, and connect with the community.

## 🌟 Features

### 📄 **Complete Website Pages**
- **Homepage** - Hero section with introduction and featured projects
- **About** - Personal story and AI journey
- **Projects** - Showcase of AI/ML projects with GitHub links
- **Blog** - Learning articles and AI insights
- **Contact** - Professional contact form and information

### 🎨 **Modern Design**
- Responsive Bootstrap 5 design
- Smooth animations and hover effects
- Professional color scheme
- Font Awesome icons
- Mobile-friendly layout

### 🛠️ **Admin Panel**
- Easy content management interface
- Form-based editing (no coding required)
- Project and blog post generators
- Code snippet generation with copy-to-clipboard
- Color customization guide
- Deployment instructions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation
1. **Clone or download this project**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the server:**
   ```bash
   npm start
   ```
4. **Open your browser:**
   - Website: http://localhost:3000
   - Admin Panel: Open `admin.html` in your browser

## 📁 Project Structure

```
personal-web/
├── app.js                 # Express server
├── package.json           # Dependencies
├── admin.html            # Admin panel for easy editing
├── EDITING-GUIDE.md      # Comprehensive editing guide
├── README.md             # This file
├── views/                # EJS templates
│   ├── index.ejs        # Homepage
│   ├── about.ejs        # About page
│   ├── projects.ejs     # Projects showcase
│   ├── blog.ejs         # Blog page
│   └── contact.ejs      # Contact page
├── public/              # Static assets
│   ├── css/style.css    # Custom styles
│   └── js/main.js       # JavaScript functionality
└── config/              # Configuration files
    └── site-config.js   # Centralized settings
```

## 🔧 Customization

### Method 1: Admin Panel (Easiest)
1. Open `admin.html` in your browser
2. Fill out the forms with your information
3. Click "Apply Changes" to get code snippets
4. Copy and paste the generated code into your files

### Method 2: Direct File Editing
1. **Personal Info**: Edit `views/index.ejs` and `views/about.ejs`
2. **Projects**: Update `views/projects.ejs` with your real projects
3. **Blog Posts**: Add your articles to `views/blog.ejs`
4. **Contact Info**: Update `views/contact.ejs` with your details
5. **Styling**: Modify `public/css/style.css` for colors and design

### Method 3: Configuration File
Edit `config/site-config.js` with your details (requires additional setup)

## 📝 Adding Content

### Adding a New Project
Use the admin panel's Project Management section or manually add to `views/projects.ejs`:

```html
<div class="col-lg-4 col-md-6">
    <div class="project-card">
        <div class="card h-100 shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                    <i class="fas fa-robot me-2"></i>Your Project Name
                </h5>
            </div>
            <div class="card-body">
                <p class="card-text">Project description here...</p>
                <div class="mb-3">
                    <span class="badge bg-primary me-2">Python</span>
                    <span class="badge bg-secondary">TensorFlow</span>
                </div>
            </div>
            <div class="card-footer bg-transparent">
                <div class="d-flex justify-content-between">
                    <a href="your-github-link" class="btn btn-outline-primary btn-sm">
                        <i class="fab fa-github me-1"></i>Code
                    </a>
                    <a href="your-demo-link" class="btn btn-primary btn-sm">
                        <i class="fas fa-external-link-alt me-1"></i>Demo
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Adding a Blog Post
Use the admin panel's Blog Management section or manually add to `views/blog.ejs`:

```html
<article class="blog-post mb-5">
    <div class="card shadow-sm">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="badge bg-primary">Machine Learning</span>
                <small class="text-muted">
                    <i class="fas fa-calendar me-1"></i>Your Date
                </small>
            </div>
            <h2 class="card-title h4">
                <a href="#" class="text-decoration-none">Your Blog Title</a>
            </h2>
            <p class="card-text">Your blog excerpt...</p>
            <div class="d-flex justify-content-between align-items-center">
                <div class="blog-tags">
                    <span class="badge bg-secondary me-1">AI</span>
                    <span class="badge bg-secondary me-1">Python</span>
                </div>
                <a href="#" class="btn btn-outline-primary btn-sm">
                    Read More <i class="fas fa-arrow-right ms-1"></i>
                </a>
            </div>
        </div>
    </div>
</article>
```

## 🎨 Customizing Colors

Edit the CSS variables in `public/css/style.css`:

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

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect your GitHub account
4. Import your repository
5. Deploy automatically!

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your project folder
3. Get your live URL!

### Heroku
1. Install Heroku CLI
2. Create a new Heroku app
3. Push to Heroku Git
4. Configure environment variables

## 🛠️ Development

### Available Scripts
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload (if nodemon is installed)

### Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating, Bootstrap 5, Font Awesome
- **Styling**: Custom CSS with CSS variables
- **JavaScript**: Vanilla JS for interactivity

## 📞 Support

- Check `EDITING-GUIDE.md` for detailed instructions
- Use the admin panel for guided editing
- Refer to the file locations guide in the admin panel

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for AI students and professionals**

Happy coding! 🚀
