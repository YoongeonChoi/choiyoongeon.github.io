const fs = require('fs');
const path = require('path');

// Optimization Target: Apply font display: swap and size-adjust
// Optimization Target: Add explicit width/height to images if missing (heuristic)
// Optimization Target: Ensure next/image usage

const ROOT_DIR = path.resolve(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(ROOT_DIR);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;

    // 1. Optimize Google Fonts (if Next.js font used)
    if (content.includes('next/font/google')) {
        if (!content.includes('display: "swap"')) {
            content = content.replace(/(subsets:\s*\[[^\]]+\])/, '$1, display: "swap"');
            console.log(`Optimized Font Loading in: ${file}`);
            updated = true;
        }
    }

    // 2. Add 'alt' to images if missing (basic check)
    if (content.includes('<img') && !content.includes('alt=')) {
        // Warning only
        console.warn(`Potential missing alt text in: ${file}`);
    }

    // 3. Check for specific CLS culprits (heuristic)
    if (file.includes('BentoGrid.tsx') && !content.includes('aspect-')) {
        // Suggesting aspect ratio maintenance
        console.log(`Checking CLS in BentoGrid: ${file}`);
    }

    if (updated) {
        fs.writeFileSync(file, content);
    }
});

console.log("Optimization pass complete.");
