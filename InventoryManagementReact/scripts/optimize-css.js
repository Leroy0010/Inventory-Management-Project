#!/usr/bin/env node

/**
 * CSS Optimization Script
 * Optimizes CSS for production builds
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const CSS_DIR = path.join(DIST_DIR, 'css');

// CSS optimization configuration
const OPTIMIZATION_CONFIG = {
    // Remove unused CSS
    purge: true,

    // Minify CSS
    minify: true,

    // Optimize selectors
    optimizeSelectors: true,

    // Remove comments
    removeComments: true,

    // Optimize properties
    optimizeProperties: true,

    // Merge rules
    mergeRules: true,

    // Remove empty rules
    removeEmptyRules: true,
};

function optimizeCSS() {
    console.log('🎨 Starting CSS optimization...');

    try {
        // Check if dist directory exists
        if (!fs.existsSync(DIST_DIR)) {
            console.error(
                '❌ Dist directory not found. Please run build first.'
            );
            process.exit(1);
        }

        // Find all CSS files
        const cssFiles = findCSSFiles(DIST_DIR);
        console.log(`📁 Found ${cssFiles.length} CSS files to optimize`);

        // Optimize each CSS file
        cssFiles.forEach((file) => {
            console.log(`🔧 Optimizing ${path.relative(DIST_DIR, file)}...`);
            optimizeCSSFile(file);
        });

        // Generate CSS report
        generateCSSReport(cssFiles);

        console.log('✅ CSS optimization completed!');
    } catch (error) {
        console.error('❌ CSS optimization failed:', error.message);
        process.exit(1);
    }
}

function findCSSFiles(dir) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        items.forEach((item) => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (item.endsWith('.css')) {
                files.push(fullPath);
            }
        });
    }

    traverse(dir);
    return files;
}

function optimizeCSSFile(filePath) {
    let css = fs.readFileSync(filePath, 'utf8');

    // Remove comments
    if (OPTIMIZATION_CONFIG.removeComments) {
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove empty rules
    if (OPTIMIZATION_CONFIG.removeEmptyRules) {
        css = css.replace(/\{[^}]*\}/g, (match) => {
            const content = match.slice(1, -1).trim();
            return content ? match : '';
        });
    }

    // Minify CSS
    if (OPTIMIZATION_CONFIG.minify) {
        css = css
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s*:\s*/g, ':')
            .trim();
    }

    // Write optimized CSS
    fs.writeFileSync(filePath, css);
}

function generateCSSReport(cssFiles) {
    const report = {
        totalFiles: cssFiles.length,
        totalSize: 0,
        optimizedSize: 0,
        files: [],
    };

    cssFiles.forEach((file) => {
        const stats = fs.statSync(file);
        const size = stats.size;

        report.totalSize += size;
        report.optimizedSize += size;
        report.files.push({
            name: path.relative(DIST_DIR, file),
            size: size,
            sizeKB: (size / 1024).toFixed(2),
        });
    });

    report.totalSizeKB = (report.totalSize / 1024).toFixed(2);
    report.optimizedSizeKB = (report.optimizedSize / 1024).toFixed(2);

    // Write report
    const reportPath = path.join(DIST_DIR, 'css-optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n📊 CSS Optimization Report:');
    console.log(`   Total files: ${report.totalFiles}`);
    console.log(`   Total size: ${report.totalSizeKB} KB`);
    console.log(`   Report saved: ${path.relative(process.cwd(), reportPath)}`);
}

// Run optimization
if (import.meta.url === `file://${process.argv[1]}`) {
    optimizeCSS();
}

export { optimizeCSS };
