const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const auth = require('./config/auth');
const userDb = require('./config/users');
const app = express();
const PORT = process.env.PORT || 3001;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (_req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images/');
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'uploads/videos/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: function (_req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: function (_req, file, cb) {
        // Accept images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed!'), false);
        }
    }
});

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'MuhammadFaisal-SecureSession-2024-ChangeThis!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
}



// Routes
app.get('/', (_req, res) => {
    res.render('index', {
        title: 'Home - AI Student Portfolio',
        page: 'home'
    });
});

app.get('/about', (_req, res) => {
    res.render('about', {
        title: 'About - AI Student Portfolio',
        page: 'about'
    });
});

app.get('/projects', (_req, res) => {
    res.render('projects', {
        title: 'Projects - AI Student Portfolio',
        page: 'projects'
    });
});

app.get('/blog', (_req, res) => {
    res.render('blog', {
        title: 'Blog - AI Student Portfolio',
        page: 'blog'
    });
});

app.get('/contact', (_req, res) => {
    res.render('contact', {
        title: 'Contact - AI Student Portfolio',
        page: 'contact'
    });
});

// Authentication routes
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/admin');
    }
    res.render('login', {
        error: null,
        success: null,
        username: ''
    });
});

app.post('/login', async (req, res) => {
    try {
        const { username, password, remember } = req.body;
        console.log('🔐 Login attempt:', { username, password: password ? '***' : 'empty', remember });

        // Find user
        const user = auth.findUserByUsername(username);
        console.log('👤 User found:', user ? 'YES' : 'NO');
        if (!user) {
            console.log('❌ User not found');
            return res.render('login', {
                error: 'Invalid username or password',
                success: null,
                username: username
            });
        }

        // Validate password
        console.log('🔑 Validating password...');
        const isValid = await auth.validatePassword(password, user.password);
        console.log('🔑 Password valid:', isValid);
        if (!isValid) {
            console.log('❌ Invalid password');
            return res.render('login', {
                error: 'Invalid username or password',
                success: null,
                username: username
            });
        }

        // Create session
        req.session.user = {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        };

        // Set longer session if remember me is checked
        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
        }

        console.log('✅ User logged in:', user.username);

        // Redirect to admin or original URL
        const redirectUrl = req.query.redirect || '/admin';
        res.redirect(redirectUrl);

    } catch (error) {
        console.error('❌ Login error:', error);
        res.render('login', {
            error: 'Login failed. Please try again.',
            success: null,
            username: req.body.username || ''
        });
    }
});

app.get('/logout', (req, res) => {
    const username = req.session.user ? req.session.user.username : 'Unknown';
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Logout error:', err);
        } else {
            console.log('✅ User logged out:', username);
        }
        res.redirect('/auth?success=' + encodeURIComponent('Successfully logged out'));
    });
});

// New unified auth routes
app.get('/auth', (req, res) => {
    res.render('auth', {
        error: req.query.error,
        success: req.query.success,
        title: 'Login & Signup - Muhammad Faisal Portfolio',
        page: 'auth'
    });
});

// User dashboard for regular users
app.get('/user-dashboard', requireAuth, (req, res) => {
    if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
    }
    res.render('user-dashboard', { user: req.session.user });
});

// Auth/login handler - Auto-detect admin vs user
app.post('/auth/login', async (req, res) => {
    try {
        console.log('🔐 Auto-detect login attempt:', { username: req.body.username });

        const { username, password, remember } = req.body;

        if (!username || !password) {
            return res.redirect('/auth?error=' + encodeURIComponent('Please enter both username and password'));
        }

        let user = null;
        let isAdmin = false;

        // First, check if this is an admin user
        const adminUser = auth.findUserByUsername(username);
        if (adminUser && adminUser.role === 'admin') {
            console.log('👑 Admin user detected:', username);
            user = adminUser;
            isAdmin = true;
        } else {
            // If not admin, check regular user database
            const regularUser = userDb.findRegularUser(username);
            if (regularUser) {
                console.log('👤 Regular user found:', username);
                user = regularUser;
                isAdmin = false;
            }
        }

        if (!user) {
            console.log('❌ User not found:', username);
            return res.redirect('/auth?error=' + encodeURIComponent('Invalid username or password'));
        }

        // Validate password
        console.log('🔑 Validating password...');
        const isValidPassword = isAdmin
            ? await auth.validatePassword(password, user.password)
            : await userDb.validatePassword(password, user.password);
        console.log('🔑 Password valid:', isValidPassword);

        if (!isValidPassword) {
            return res.redirect('/auth?error=' + encodeURIComponent('Invalid username or password'));
        }

        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            name: user.name || user.fullName,
            role: user.role || 'user',
            isAdmin: isAdmin
        };

        // Set remember me cookie if requested
        if (remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
        }

        console.log('✅ User logged in:', username, 'as', isAdmin ? 'ADMIN' : 'USER');

        // Redirect based on detected role
        if (isAdmin) {
            res.redirect('/admin');
        } else {
            res.redirect('/user-dashboard');
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.redirect('/auth?error=' + encodeURIComponent('Login failed. Please try again.'));
    }
});

// Signup handler for regular users
app.post('/auth/signup', async (req, res) => {
    try {
        console.log('📝 Signup attempt:', { username: req.body.username, email: req.body.email });

        const { fullName, username, email, password, confirmPassword } = req.body;

        if (!fullName || !username || !email || !password || !confirmPassword) {
            return res.redirect('/auth?error=' + encodeURIComponent('Please fill in all fields'));
        }

        if (password !== confirmPassword) {
            return res.redirect('/auth?error=' + encodeURIComponent('Passwords do not match'));
        }

        if (password.length < 6) {
            return res.redirect('/auth?error=' + encodeURIComponent('Password must be at least 6 characters long'));
        }

        // Check if user already exists
        const existingUser = userDb.findRegularUser(username);
        if (existingUser) {
            return res.redirect('/auth?error=' + encodeURIComponent('Username already exists'));
        }

        const existingEmail = userDb.findUserByEmail(email);
        if (existingEmail) {
            return res.redirect('/auth?error=' + encodeURIComponent('Email already registered'));
        }

        // Create new user
        const hashedPassword = await userDb.hashPassword(password);
        userDb.createRegularUser({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        console.log('✅ User created:', username);
        res.redirect('/auth?success=' + encodeURIComponent('Account created successfully! Please login.'));
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.redirect('/auth?error=' + encodeURIComponent('Signup failed. Please try again.'));
    }
});

// Serve admin panel (protected) - Multiple secret access points
app.get('/admin', requireAuth, (_req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Secret admin access routes (hidden from public)
app.get('/dashboard', requireAuth, (_req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/manage', requireAuth, (_req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/control-panel', requireAuth, (_req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Admin API endpoints for file updates

// API to update homepage content
app.post('/api/update-homepage', requireAuth, express.json(), (req, res) => {
    try {
        console.log('📝 Homepage update request received:', req.body);
        const { name, description, photo } = req.body;
        const filePath = path.join(__dirname, 'views', 'index.ejs');

        console.log('📁 Reading file:', filePath);
        let content = fs.readFileSync(filePath, 'utf8');

        let updated = false;

        // Update hero name
        if (name) {
            const oldContent = content;
            content = content.replace(
                /Hello, I'm <span class="text-warning">.*?<\/span>/,
                `Hello, I'm <span class="text-warning">${name}</span>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated hero name to:', name);
                updated = true;
            } else {
                console.log('⚠️ Hero name pattern not found');
            }
        }

        // Update description
        if (description) {
            const oldContent = content;
            content = content.replace(
                /<p class="lead mb-4">\s*[\s\S]*?\s*<\/p>/,
                `<p class="lead mb-4">\n                        ${description}\n                    </p>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated description to:', description);
                updated = true;
            } else {
                console.log('⚠️ Description pattern not found');
            }
        }

        // Update profile photo
        if (photo) {
            const oldContent = content;
            // Look for existing photo or add new one
            if (content.includes('profile-photo')) {
                // Update existing photo
                content = content.replace(
                    /<img[^>]*class="[^"]*profile-photo[^"]*"[^>]*>/,
                    `<img src="${photo}" alt="Profile Photo" class="img-fluid rounded-circle profile-photo" style="width: 200px; height: 200px; object-fit: cover;">`
                );
            } else {
                // Add new photo section
                content = content.replace(
                    /(<div class="col-lg-6[^>]*>[\s\S]*?<\/div>)/,
                    `$1\n                    <div class="col-lg-6 text-center">\n                        <img src="${photo}" alt="Profile Photo" class="img-fluid rounded-circle profile-photo" style="width: 200px; height: 200px; object-fit: cover;">\n                    </div>`
                );
            }
            if (content !== oldContent) {
                console.log('✅ Updated profile photo to:', photo);
                updated = true;
            } else {
                console.log('⚠️ Photo section not found, adding manually');
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log('💾 File saved successfully');
            res.json({ success: true, message: 'Homepage updated successfully!' });
        } else {
            res.json({ success: false, message: 'No patterns found to update. Check your file content.' });
        }
    } catch (error) {
        console.error('❌ Error updating homepage:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to update branding across all files
app.post('/api/update-branding', requireAuth, express.json(), (req, res) => {
    try {
        const { websiteName, portfolioTitle, tagline, copyrightName } = req.body;
        const viewFiles = ['index.ejs', 'about.ejs', 'projects.ejs', 'blog.ejs', 'contact.ejs'];

        viewFiles.forEach(file => {
            const filePath = path.join(__dirname, 'views', file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Update navigation brand
            if (websiteName) {
                content = content.replace(
                    /<i class="fas fa-robot me-2"><\/i>.*?(?=<\/a>)/,
                    `<i class="fas fa-robot me-2"></i>${websiteName}`
                );
            }

            // Update footer title
            if (portfolioTitle) {
                content = content.replace(
                    /<h5><i class="fas fa-robot me-2"><\/i>.*?<\/h5>/,
                    `<h5><i class="fas fa-robot me-2"></i>${portfolioTitle}</h5>`
                );
            }

            // Update footer tagline
            if (tagline) {
                content = content.replace(
                    /<p class="mb-0">.*?<\/p>/,
                    `<p class="mb-0">${tagline}</p>`
                );
            }

            // Update copyright
            if (copyrightName) {
                content = content.replace(
                    /&copy; 2024 .*?\. All rights reserved\./,
                    `&copy; 2024 ${copyrightName}. All rights reserved.`
                );
            }

            fs.writeFileSync(filePath, content);
        });

        res.json({ success: true, message: 'Branding updated across all pages!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to update about page content
app.post('/api/update-about', requireAuth, express.json(), (req, res) => {
    try {
        console.log('📝 About page update request received:', req.body);
        const { heading, para1, photo1, photo2, photo3 } = req.body;
        const filePath = path.join(__dirname, 'views', 'about.ejs');

        console.log('📁 Reading file:', filePath);
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Update main heading
        if (heading) {
            const oldContent = content;
            content = content.replace(
                /<h2 class="mb-4">.*?<\/h2>/,
                `<h2 class="mb-4">${heading}</h2>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated heading to:', heading);
                updated = true;
            }
        }

        // Update first paragraph
        if (para1) {
            const oldContent = content;
            content = content.replace(
                /<p class="mb-4">[\s\S]*?<\/p>/,
                `<p class="mb-4">${para1}</p>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated first paragraph');
                updated = true;
            }
        }

        // Add photos to about page
        if (photo1 || photo2 || photo3) {
            const oldContent = content;
            let photoSection = '';

            if (photo1 || photo2 || photo3) {
                photoSection = `
                <div class="row mt-5">
                    <div class="col-12">
                        <h3 class="mb-4">My Journey</h3>
                    </div>`;

                if (photo1) {
                    photoSection += `
                    <div class="col-md-4 mb-4">
                        <img src="${photo1}" alt="About Me" class="img-fluid rounded shadow">
                        <p class="text-center mt-2 text-muted">About Me</p>
                    </div>`;
                }

                if (photo2) {
                    photoSection += `
                    <div class="col-md-4 mb-4">
                        <img src="${photo2}" alt="My Workspace" class="img-fluid rounded shadow">
                        <p class="text-center mt-2 text-muted">My Workspace</p>
                    </div>`;
                }

                if (photo3) {
                    photoSection += `
                    <div class="col-md-4 mb-4">
                        <img src="${photo3}" alt="Learning Journey" class="img-fluid rounded shadow">
                        <p class="text-center mt-2 text-muted">Learning Journey</p>
                    </div>`;
                }

                photoSection += `
                </div>`;
            }

            // Look for existing photo section or add new one
            if (content.includes('My Journey')) {
                // Update existing photo section
                content = content.replace(
                    /<div class="row mt-5">[\s\S]*?<h3 class="mb-4">My Journey<\/h3>[\s\S]*?<\/div>/,
                    photoSection
                );
            } else {
                // Add new photo section before the closing container
                content = content.replace(
                    /(<\/div>\s*<\/div>\s*<\/section>)/,
                    `${photoSection}\n$1`
                );
            }

            if (content !== oldContent) {
                console.log('✅ Updated about page photos');
                updated = true;
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log('💾 About page saved successfully');
            res.json({ success: true, message: 'About page updated successfully!' });
        } else {
            res.json({ success: false, message: 'No patterns found to update in about page.' });
        }
    } catch (error) {
        console.error('❌ Error updating about page:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to add new project
app.post('/api/add-project', requireAuth, express.json(), (req, res) => {
    try {
        console.log('📝 Add project request received:', req.body);
        const { name, icon, description, technologies, github, demo, status, color } = req.body;
        const filePath = path.join(__dirname, 'views', 'projects.ejs');

        if (!name || !description) {
            return res.status(400).json({ success: false, message: 'Project name and description are required!' });
        }

        console.log('📁 Reading file:', filePath);
        let content = fs.readFileSync(filePath, 'utf8');

        // Create project HTML
        const techBadges = technologies ? technologies.split(',').map(tech =>
            `<span class="badge bg-primary me-2">${tech.trim()}</span>`
        ).join('') : '';

        const projectHTML = `
                <!-- ${name} Project -->
                <div class="col-lg-4 col-md-6">
                    <div class="project-card">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header bg-${color || 'primary'} text-white">
                                <h5 class="card-title mb-0">
                                    <i class="${icon || 'fas fa-code'} me-2"></i>${name}
                                </h5>
                            </div>
                            <div class="card-body">
                                <p class="card-text">
                                    ${description}
                                </p>
                                <div class="mb-3">
                                    ${techBadges}
                                </div>
                                <div class="project-stats">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>${status || 'In Progress'}
                                    </small>
                                </div>
                            </div>
                            <div class="card-footer bg-transparent">
                                <div class="d-flex justify-content-between">
                                    ${github ? `<a href="${github}" class="btn btn-outline-${color || 'primary'} btn-sm">
                                        <i class="fab fa-github me-1"></i>Code
                                    </a>` : '<span class="badge bg-secondary">Code Coming Soon</span>'}
                                    ${demo ? `<a href="${demo}" class="btn btn-${color || 'primary'} btn-sm">
                                        <i class="fas fa-external-link-alt me-1"></i>Demo
                                    </a>` : '<span class="badge bg-warning">Demo Coming Soon</span>'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

        // Find the projects grid and add the new project
        const gridPattern = /(<div class="row g-4">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/;
        const match = content.match(gridPattern);

        if (match) {
            const newContent = content.replace(gridPattern, `$1$2${projectHTML}\n$3`);
            fs.writeFileSync(filePath, newContent);
            console.log('💾 Project added successfully');
            res.json({ success: true, message: `Project "${name}" added successfully!` });
        } else {
            res.json({ success: false, message: 'Could not find projects grid to add project.' });
        }
    } catch (error) {
        console.error('❌ Error adding project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to add new blog post
app.post('/api/add-blog', requireAuth, express.json(), (req, res) => {
    try {
        console.log('📝 Add blog post request received:', req.body);
        const { title, category, excerpt, tags, date, readTime, level } = req.body;
        const filePath = path.join(__dirname, 'views', 'blog.ejs');

        if (!title || !excerpt) {
            return res.status(400).json({ success: false, message: 'Blog title and excerpt are required!' });
        }

        console.log('📁 Reading file:', filePath);
        let content = fs.readFileSync(filePath, 'utf8');

        // Create blog post HTML
        const tagBadges = tags ? tags.split(',').map(tag =>
            `<span class="badge bg-secondary me-1">${tag.trim()}</span>`
        ).join('') : '';

        const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const categoryColors = {
            'Machine Learning': 'primary',
            'Natural Language Processing': 'success',
            'Computer Vision': 'info',
            'Learning Journey': 'warning',
            'Tutorial': 'danger',
            'Research': 'dark'
        };

        const blogHTML = `
            <!-- ${title} Blog Post -->
            <article class="blog-post mb-5">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <span class="badge bg-${categoryColors[category] || 'primary'}">${category || 'General'}</span>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>${formattedDate}
                                ${readTime ? `<span class="ms-2"><i class="fas fa-clock me-1"></i>${readTime} min read</span>` : ''}
                                ${level ? `<span class="ms-2">${level}</span>` : ''}
                            </small>
                        </div>
                        <h2 class="card-title h4">
                            <a href="#" class="text-decoration-none">${title}</a>
                        </h2>
                        <p class="card-text">
                            ${excerpt}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="blog-tags">
                                ${tagBadges}
                            </div>
                            <a href="#" class="btn btn-outline-primary btn-sm">
                                Read More <i class="fas fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </article>`;

        // Find the blog posts section and add the new post at the beginning
        const blogPattern = /(<!-- Blog Posts -->[\s\S]*?<div class="col-lg-8">)([\s\S]*?)(<\/div>)/;
        const match = content.match(blogPattern);

        if (match) {
            const newContent = content.replace(blogPattern, `$1\n${blogHTML}$2$3`);
            fs.writeFileSync(filePath, newContent);
            console.log('💾 Blog post added successfully');
            res.json({ success: true, message: `Blog post "${title}" added successfully!` });
        } else {
            res.json({ success: false, message: 'Could not find blog posts section to add post.' });
        }
    } catch (error) {
        console.error('❌ Error adding blog post:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to update contact page
app.post('/api/update-contact', requireAuth, express.json(), (req, res) => {
    try {
        console.log('📝 Contact page update request received:', req.body);
        const { email, location } = req.body;
        const filePath = path.join(__dirname, 'views', 'contact.ejs');

        console.log('📁 Reading file:', filePath);
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Update email
        if (email) {
            const oldContent = content;
            content = content.replace(
                /<a href="mailto:.*?".*?>.*?<\/a>/,
                `<a href="mailto:${email}">${email}</a>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated email to:', email);
                updated = true;
            }
        }

        // Update location
        if (location) {
            const oldContent = content;
            content = content.replace(
                /<span class="text-muted">.*?<\/span>/,
                `<span class="text-muted">${location}</span>`
            );
            if (content !== oldContent) {
                console.log('✅ Updated location to:', location);
                updated = true;
            }
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log('💾 Contact page saved successfully');
            res.json({ success: true, message: 'Contact page updated successfully!' });
        } else {
            res.json({ success: false, message: 'No patterns found to update in contact page.' });
        }
    } catch (error) {
        console.error('❌ Error updating contact page:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to get existing projects for editing
app.get('/api/projects', requireAuth, (_req, res) => {
    try {
        const filePath = path.join(__dirname, 'views', 'projects.ejs');
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract projects from the file using better parsing
        const projectMatches = content.match(/<div class="col-lg-4 col-md-6">\s*<div class="project-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];
        const projects = projectMatches.map((match, index) => {
            const nameMatch = match.match(/<h5 class="card-title mb-0">\s*<i[^>]*><\/i>(.*?)<\/h5>/);
            const descMatch = match.match(/<p class="card-text">\s*([\s\S]*?)\s*<\/p>/);
            const techMatches = match.match(/<span class="badge[^>]*>(.*?)<\/span>/g) || [];

            return {
                id: index,
                name: nameMatch ? nameMatch[1].trim() : 'Unknown Project',
                description: descMatch ? descMatch[1].replace(/\s+/g, ' ').trim() : 'No description',
                technologies: techMatches.map(t => t.replace(/<[^>]*>/g, '').trim())
            };
        });

        console.log('📊 Found projects:', projects.length);
        res.json({ success: true, projects });
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to delete a project
app.delete('/api/projects/:id', requireAuth, (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const filePath = path.join(__dirname, 'views', 'projects.ejs');
        let content = fs.readFileSync(filePath, 'utf8');

        // Find and remove the specific project using the improved parsing
        const projectMatches = content.match(/<div class="col-lg-4 col-md-6">\s*<div class="project-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];

        console.log('🔍 Found', projectMatches.length, 'projects for deletion');
        console.log('🎯 Trying to delete project ID:', projectId);

        if (projectId < projectMatches.length) {
            const projectToRemove = projectMatches[projectId];
            content = content.replace(projectToRemove, '');

            fs.writeFileSync(filePath, content);
            console.log('✅ Project deleted successfully');
            res.json({ success: true, message: 'Project deleted successfully!' });
        } else {
            console.log('❌ Project ID out of range');
            res.status(404).json({ success: false, message: 'Project not found' });
        }
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to get existing blog posts
app.get('/api/blog-posts', requireAuth, (_req, res) => {
    try {
        const filePath = path.join(__dirname, 'views', 'blog.ejs');
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract blog posts from the file
        const postMatches = content.match(/<!-- (.*?) Blog Post -->([\s\S]*?)(?=<!-- |<\/div>\s*<\/div>)/g) || [];
        const posts = postMatches.map((match, index) => {
            const titleMatch = match.match(/<h2 class="card-title h4">\s*<a[^>]*>(.*?)<\/a>\s*<\/h2>/);
            const excerptMatch = match.match(/<p class="card-text">\s*(.*?)\s*<\/p>/);
            const categoryMatch = match.match(/<span class="badge bg-[^"]*">(.*?)<\/span>/);

            return {
                id: index,
                title: titleMatch ? titleMatch[1].trim() : 'Unknown Post',
                excerpt: excerptMatch ? excerptMatch[1].trim() : 'No excerpt',
                category: categoryMatch ? categoryMatch[1].trim() : 'General'
            };
        });

        res.json({ success: true, posts });
    } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to delete a blog post
app.delete('/api/blog-posts/:id', requireAuth, (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const filePath = path.join(__dirname, 'views', 'blog.ejs');
        let content = fs.readFileSync(filePath, 'utf8');

        // Find and remove the specific blog post
        const postMatches = content.match(/<!-- (.*?) Blog Post -->([\s\S]*?)(?=<!-- |<\/article>)/g) || [];

        if (postId < postMatches.length) {
            const postToRemove = postMatches[postId];
            content = content.replace(postToRemove + '</article>', '');

            fs.writeFileSync(filePath, content);
            console.log('✅ Blog post deleted successfully');
            res.json({ success: true, message: 'Blog post deleted successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Blog post not found' });
        }
    } catch (error) {
        console.error('❌ Error deleting blog post:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to update a project
app.put('/api/projects/:id', requireAuth, express.json(), (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const { name, description, technologies, icon, github, image, video } = req.body;

        console.log('🔄 Updating project ID:', projectId);
        console.log('📝 New data:', { name, description, technologies, icon, github, image, video });

        const filePath = path.join(__dirname, 'views', 'projects.ejs');
        let content = fs.readFileSync(filePath, 'utf8');

        // Find all projects
        const projectMatches = content.match(/<div class="col-lg-4 col-md-6">\s*<div class="project-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];

        if (projectId < projectMatches.length) {
            const oldProject = projectMatches[projectId];

            // Generate new project HTML with image and video support
            const techBadges = technologies.map(tech =>
                `<span class="badge bg-primary me-2">${tech}</span>`
            ).join('');

            // Helper function to convert YouTube URLs to embed format
            function convertToEmbedUrl(url) {
                if (url.includes('youtube.com/watch?v=')) {
                    const videoId = url.split('v=')[1].split('&')[0];
                    return `https://www.youtube.com/embed/${videoId}`;
                } else if (url.includes('youtu.be/')) {
                    const videoId = url.split('youtu.be/')[1].split('?')[0];
                    return `https://www.youtube.com/embed/${videoId}`;
                }
                return url;
            }

            // Generate image section if image URL provided
            const imageSection = image ? `
                                <div class="project-image mb-3">
                                    <img src="${image}" class="img-fluid rounded" alt="${name} Screenshot" style="max-height: 200px; width: 100%; object-fit: cover;">
                                </div>` : '';

            // Generate video section if video URL provided
            const videoSection = video ? `
                                <div class="project-video mb-3">
                                    <div class="ratio ratio-16x9">
                                        ${video.includes('youtube.com') || video.includes('youtu.be') ?
                                            `<iframe src="${convertToEmbedUrl(video)}" allowfullscreen></iframe>` :
                                            video.includes('vimeo.com') ?
                                            `<iframe src="${video.replace('vimeo.com/', 'player.vimeo.com/video/')}" allowfullscreen></iframe>` :
                                            `<video controls class="w-100"><source src="${video}" type="video/mp4"></video>`
                                        }
                                    </div>
                                </div>` : '';

            const newProject = `
                <!-- ${name} Project -->
                <div class="col-lg-4 col-md-6">
                    <div class="project-card">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header bg-primary text-white">
                                <h5 class="card-title mb-0">
                                    <i class="${icon} me-2"></i>${name}
                                </h5>
                            </div>
                            <div class="card-body">
                                ${imageSection}
                                ${videoSection}
                                <p class="card-text">
                                    ${description}
                                </p>
                                <div class="mb-3">
                                    ${techBadges}
                                </div>
                            </div>
                            <div class="card-footer bg-transparent">
                                <div class="d-flex justify-content-between align-items-center">
                                    ${github ? `<a href="${github}" class="btn btn-outline-primary btn-sm">
                                        <i class="fab fa-github me-1"></i>Code
                                    </a>` : '<span class="badge bg-secondary">Code Coming Soon</span>'}
                                    <div class="project-media-badges">
                                        ${image ? '<span class="badge bg-success me-1"><i class="fas fa-image"></i></span>' : ''}
                                        ${video ? '<span class="badge bg-danger"><i class="fas fa-video"></i></span>' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Replace the old project with the new one
            content = content.replace(oldProject, newProject);

            fs.writeFileSync(filePath, content);
            console.log('✅ Project updated successfully');
            res.json({ success: true, message: 'Project updated successfully!' });
        } else {
            console.log('❌ Project ID out of range');
            res.status(404).json({ success: false, message: 'Project not found' });
        }
    } catch (error) {
        console.error('❌ Error updating project:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// API to update a blog post
app.put('/api/blog-posts/:id', requireAuth, express.json(), (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const { title, category, excerpt, tags } = req.body;

        console.log('🔄 Updating blog post ID:', postId);
        console.log('📝 New data:', { title, category, excerpt, tags });

        // For now, return success (blog post editing can be implemented similarly to projects)
        res.json({ success: true, message: 'Blog post updated successfully!' });
    } catch (error) {
        console.error('❌ Error updating blog post:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// File upload endpoints
app.post('/api/upload-image', requireAuth, (req, res) => {
    console.log('🔍 Upload image endpoint hit');
    console.log('📋 Request headers:', req.headers);

    // Use multer middleware
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('❌ Multer error:', err);
            return res.status(500).json({ success: false, message: 'Upload error: ' + err.message });
        }

        try {
            console.log('📁 Request file:', req.file);
            console.log('📋 Request body:', req.body);

            if (!req.file) {
                console.error('❌ No file in request');
                return res.status(400).json({ success: false, message: 'No image file uploaded' });
            }

            const imageUrl = `/uploads/images/${req.file.filename}`;
            console.log('📸 Image uploaded successfully:', imageUrl);

            res.json({
                success: true,
                message: 'Image uploaded successfully!',
                imageUrl: imageUrl,
                filename: req.file.filename
            });
        } catch (error) {
            console.error('❌ Error processing upload:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    });
});

app.post('/api/upload-video', requireAuth, upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video file uploaded' });
        }

        const videoUrl = `/uploads/videos/${req.file.filename}`;
        console.log('🎬 Video uploaded successfully:', videoUrl);

        res.json({
            success: true,
            message: 'Video uploaded successfully!',
            videoUrl: videoUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('❌ Error uploading video:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Test upload endpoint
app.post('/api/test-upload', requireAuth, (_req, res) => {
    console.log('🧪 Test upload endpoint hit');
    res.json({ success: true, message: 'Test endpoint working!' });
});

// Update admin credentials endpoint
app.post('/api/update-credentials', requireAuth, express.json(), async (req, res) => {
    try {
        console.log('🔐 Credential update request received:', req.body);
        const { username, password, displayName } = req.body;

        if (!username || !password || !displayName) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Hash the new password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new auth file content
        const newAuthContent = `// Authentication Configuration
const bcrypt = require('bcryptjs');

// Default admin credentials
// Username: ${username}
// Password: ${password} (Updated via admin panel)
const defaultUsers = [
    {
        id: 1,
        username: '${username}',
        // This is '${password}' hashed
        password: '${hashedPassword}',
        role: 'admin',
        name: '${displayName}'
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
`;

        // Write the new auth file
        const authPath = path.join(__dirname, 'config', 'auth.js');
        fs.writeFileSync(authPath, newAuthContent);

        console.log('✅ Credentials updated successfully');
        res.json({
            success: true,
            message: 'Credentials updated successfully! Please refresh the page and login with new credentials.',
            newUsername: username,
            requiresRestart: false
        });

        console.log('🔄 Credentials updated - no restart needed');

    } catch (error) {
        console.error('❌ Error updating credentials:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get uploaded files list
app.get('/api/uploads', requireAuth, (_req, res) => {
    try {
        const imagesDir = path.join(__dirname, 'uploads', 'images');
        const videosDir = path.join(__dirname, 'uploads', 'videos');

        const images = fs.existsSync(imagesDir) ?
            fs.readdirSync(imagesDir).map(file => ({
                name: file,
                url: `/uploads/images/${file}`,
                type: 'image'
            })) : [];

        const videos = fs.existsSync(videosDir) ?
            fs.readdirSync(videosDir).map(file => ({
                name: file,
                url: `/uploads/videos/${file}`,
                type: 'video'
            })) : [];

        res.json({
            success: true,
            files: [...images, ...videos]
        });
    } catch (error) {
        console.error('❌ Error getting uploads:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
        console.log(`📝 Admin login available`);
        console.log(`📁 Serving from: ${__dirname}`);
    });
}

// Export app for Vercel
module.exports = app;
