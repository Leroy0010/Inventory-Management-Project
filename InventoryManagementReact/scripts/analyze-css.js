#!/usr/bin/env node

/**
 * CSS Analysis Script
 * Analyzes CSS bundle size and provides optimization recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const CSS_DIR = path.join(DIST_DIR, 'css');

function analyzeCSS() {
    console.log('🔍 Analyzing CSS bundle...');

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
        console.log(`📁 Found ${cssFiles.length} CSS files to analyze`);

        // Analyze each CSS file
        const analysis = {
            totalFiles: cssFiles.length,
            totalSize: 0,
            totalGzippedSize: 0,
            files: [],
            recommendations: [],
        };

        cssFiles.forEach((file) => {
            const fileAnalysis = analyzeCSSFile(file);
            analysis.files.push(fileAnalysis);
            analysis.totalSize += fileAnalysis.size;
            analysis.totalGzippedSize += fileAnalysis.gzippedSize;
        });

        // Generate recommendations
        analysis.recommendations = generateRecommendations(analysis);

        // Display results
        displayAnalysis(analysis);

        // Save detailed report
        saveAnalysisReport(analysis);
    } catch (error) {
        console.error('❌ CSS analysis failed:', error.message);
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

function analyzeCSSFile(filePath) {
    const css = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    const size = stats.size;

    // Calculate gzipped size (approximation)
    const gzippedSize = Math.round(size * 0.3);

    // Analyze CSS content
    const lines = css.split('\n');
    const rules = css.match(/\{[^}]*\}/g) || [];
    const selectors = css.match(/[^{}]+(?=\s*\{)/g) || [];
    const properties = css.match(/[a-zA-Z-]+:\s*[^;]+;/g) || [];

    // Count different types of rules
    const mediaQueries = css.match(/@media[^{]+\{/g) || [];
    const keyframes = css.match(/@keyframes[^{]+\{/g) || [];
    const imports = css.match(/@import[^;]+;/g) || [];
    const comments = css.match(/\/\*[\s\S]*?\*\//g) || [];

    // Analyze unused CSS (simplified)
    const unusedRules = analyzeUnusedRules(css);

    return {
        name: path.relative(DIST_DIR, filePath),
        size: size,
        sizeKB: (size / 1024).toFixed(2),
        gzippedSize: gzippedSize,
        gzippedSizeKB: (gzippedSize / 1024).toFixed(2),
        lines: lines.length,
        rules: rules.length,
        selectors: selectors.length,
        properties: properties.length,
        mediaQueries: mediaQueries.length,
        keyframes: keyframes.length,
        imports: imports.length,
        comments: comments.length,
        unusedRules: unusedRules,
        compressionRatio: (((size - gzippedSize) / size) * 100).toFixed(1),
    };
}

function analyzeUnusedRules(css) {
    // This is a simplified analysis - in a real implementation,
    // you would use tools like PurgeCSS or UnusedCSS
    const commonUnusedPatterns = [
        /\.debug[^{]*\{[^}]*\}/g,
        /\.test[^{]*\{[^}]*\}/g,
        /\.dev[^{]*\{[^}]*\}/g,
        /\/\*[\s\S]*?\*\//g,
        /\s*\{\s*\}/g,
    ];

    let unusedCount = 0;
    commonUnusedPatterns.forEach((pattern) => {
        const matches = css.match(pattern) || [];
        unusedCount += matches.length;
    });

    return unusedCount;
}

function generateRecommendations(analysis) {
    const recommendations = [];

    // Size-based recommendations
    if (analysis.totalSize > 200 * 1024) {
        // 200KB
        recommendations.push({
            type: 'size',
            priority: 'high',
            message:
                'CSS bundle is large (>200KB). Consider code splitting or purging unused CSS.',
            impact: 'High',
        });
    }

    // File count recommendations
    if (analysis.totalFiles > 10) {
        recommendations.push({
            type: 'files',
            priority: 'medium',
            message:
                'Many CSS files detected. Consider consolidating or using CSS modules.',
            impact: 'Medium',
        });
    }

    // Compression recommendations
    const avgCompression =
        analysis.files.reduce(
            (sum, file) => sum + parseFloat(file.compressionRatio),
            0
        ) / analysis.files.length;
    if (avgCompression < 60) {
        recommendations.push({
            type: 'compression',
            priority: 'medium',
            message:
                'CSS compression could be improved. Consider using more aggressive minification.',
            impact: 'Medium',
        });
    }

    // Unused CSS recommendations
    const totalUnused = analysis.files.reduce(
        (sum, file) => sum + file.unusedRules,
        0
    );
    if (totalUnused > 50) {
        recommendations.push({
            type: 'unused',
            priority: 'high',
            message: `${totalUnused} potentially unused CSS rules detected. Consider purging unused CSS.`,
            impact: 'High',
        });
    }

    // Performance recommendations
    if (analysis.totalGzippedSize > 50 * 1024) {
        // 50KB gzipped
        recommendations.push({
            type: 'performance',
            priority: 'high',
            message:
                'CSS bundle may impact loading performance. Consider critical CSS extraction.',
            impact: 'High',
        });
    }

    return recommendations;
}

function displayAnalysis(analysis) {
    console.log('\n📊 CSS Analysis Results:');
    console.log('═'.repeat(50));

    console.log(`\n📁 Bundle Overview:`);
    console.log(`   Total files: ${analysis.totalFiles}`);
    console.log(`   Total size: ${(analysis.totalSize / 1024).toFixed(2)} KB`);
    console.log(
        `   Gzipped size: ${(analysis.totalGzippedSize / 1024).toFixed(2)} KB`
    );
    console.log(
        `   Average compression: ${(((analysis.totalSize - analysis.totalGzippedSize) / analysis.totalSize) * 100).toFixed(1)}%`
    );

    console.log(`\n📄 File Details:`);
    analysis.files.forEach((file) => {
        console.log(`   ${file.name}:`);
        console.log(
            `     Size: ${file.sizeKB} KB (${file.gzippedSizeKB} KB gzipped)`
        );
        console.log(
            `     Rules: ${file.rules}, Selectors: ${file.selectors}, Properties: ${file.properties}`
        );
        console.log(`     Compression: ${file.compressionRatio}%`);
        if (file.unusedRules > 0) {
            console.log(
                `     ⚠️  ${file.unusedRules} potentially unused rules`
            );
        }
    });

    if (analysis.recommendations.length > 0) {
        console.log(`\n💡 Recommendations:`);
        analysis.recommendations.forEach((rec, index) => {
            const priority =
                rec.priority === 'high'
                    ? '🔴'
                    : rec.priority === 'medium'
                      ? '🟡'
                      : '🟢';
            console.log(`   ${index + 1}. ${priority} ${rec.message}`);
            console.log(`      Impact: ${rec.impact}`);
        });
    }

    console.log('\n✅ Analysis completed!');
}

function saveAnalysisReport(analysis) {
    const reportPath = path.join(DIST_DIR, 'css-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    console.log(
        `\n📄 Detailed report saved: ${path.relative(process.cwd(), reportPath)}`
    );
}

// Run analysis
if (import.meta.url === `file://${process.argv[1]}`) {
    analyzeCSS();
}

export { analyzeCSS };
