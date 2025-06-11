const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create public directory
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

// Copy static files
const copyDir = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

// Copy CSS, JS, and uploads
if (fs.existsSync('public/css')) copyDir('public/css', 'public/css');
if (fs.existsSync('public/js')) copyDir('public/js', 'public/js');
if (fs.existsSync('uploads')) copyDir('uploads', 'public/uploads');

// Generate static HTML files
const pages = [
    { name: 'index', title: 'Home - Muhammad Faisal Portfolio', page: 'home' },
    { name: 'about', title: 'About - Muhammad Faisal Portfolio', page: 'about' },
    { name: 'projects', title: 'Projects - Muhammad Faisal Portfolio', page: 'projects' },
    { name: 'blog', title: 'Blog - Muhammad Faisal Portfolio', page: 'blog' },
    { name: 'contact', title: 'Contact - Muhammad Faisal Portfolio', page: 'contact' }
];

pages.forEach(pageInfo => {
    const template = fs.readFileSync(`views/${pageInfo.name}.ejs`, 'utf8');
    const html = ejs.render(template, {
        title: pageInfo.title,
        page: pageInfo.page
    });
    
    const outputFile = pageInfo.name === 'index' ? 'public/index.html' : `public/${pageInfo.name}.html`;
    fs.writeFileSync(outputFile, html);
    console.log(`✅ Generated ${outputFile}`);
});

console.log('🎉 Build completed! Ready for Netlify upload.');
console.log('📁 Upload the "public" folder to Netlify.');
