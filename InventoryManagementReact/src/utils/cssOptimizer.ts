/**
 * CSS Optimization Utilities
 * Provides functions for optimizing CSS in production builds
 */

// CSS classes that should be purged in production
export const PURGEABLE_CLASSES = [
    // Development-only classes
    'debug',
    'debug-*',
    'test-*',
    'dev-*',

    // Unused utility classes
    'sr-only',
    'not-sr-only',
    'focus-within:',
    'hover:',
    'focus:',
    'active:',
    'visited:',
    'disabled:',
    'group-hover:',
    'group-focus:',
    'group-active:',
    'group-disabled:',
    'group-visited:',
    'group-checked:',
    'group-focus-within:',
    'group-invalid:',
    'group-valid:',
    'group-required:',
    'group-optional:',
    'group-read-only:',
    'group-read-write:',
    'group-empty:',
    'group-not-empty:',
    'group-focus-visible:',
    'group-target:',
    'group-in-range:',
    'group-out-of-range:',
    'group-placeholder-shown:',
    'group-placeholder:',
    'group-autofill:',
    'group-invalid:',
    'group-valid:',
    'group-required:',
    'group-optional:',
    'group-read-only:',
    'group-read-write:',
    'group-empty:',
    'group-not-empty:',
    'group-focus-visible:',
    'group-target:',
    'group-in-range:',
    'group-out-of-range:',
    'group-placeholder-shown:',
    'group-placeholder:',
    'group-autofill:',
];

// Critical CSS selectors that should always be included
export const CRITICAL_SELECTORS = [
    'html',
    'body',
    '.loading-spinner',
    '.text-center',
    '.min-h-screen',
    '.flex',
    '.items-center',
    '.justify-center',
    '.w-full',
    '.h-full',
    '.p-4',
    '.space-y-4',
    '.text-sm',
    '.text-muted-foreground',
    '.dark',
    '.dark .loading-spinner',
    '.dark .text-muted-foreground',
];

// CSS properties that can be optimized
export const OPTIMIZABLE_PROPERTIES = {
    // Shorthand properties
    'margin-top': 'margin',
    'margin-right': 'margin',
    'margin-bottom': 'margin',
    'margin-left': 'margin',
    'padding-top': 'padding',
    'padding-right': 'padding',
    'padding-bottom': 'padding',
    'padding-left': 'padding',
    'border-top': 'border',
    'border-right': 'border',
    'border-bottom': 'border',
    'border-left': 'border',
    'border-top-width': 'border-width',
    'border-right-width': 'border-width',
    'border-bottom-width': 'border-width',
    'border-left-width': 'border-width',
    'border-top-style': 'border-style',
    'border-right-style': 'border-style',
    'border-bottom-style': 'border-style',
    'border-left-style': 'border-style',
    'border-top-color': 'border-color',
    'border-right-color': 'border-color',
    'border-bottom-color': 'border-color',
    'border-left-color': 'border-color',

    // Color properties
    'background-color': 'background',
    color: 'color',

    // Layout properties
    display: 'display',
    position: 'position',
    top: 'inset',
    right: 'inset',
    bottom: 'inset',
    left: 'inset',
    width: 'size',
    height: 'size',
    'min-width': 'min-size',
    'min-height': 'min-size',
    'max-width': 'max-size',
    'max-height': 'max-size',

    // Flexbox properties
    'flex-direction': 'flex',
    'flex-wrap': 'flex',
    'justify-content': 'justify',
    'align-items': 'align',
    'align-content': 'align',
    'align-self': 'align-self',
    'flex-grow': 'flex',
    'flex-shrink': 'flex',
    'flex-basis': 'flex',
    order: 'order',

    // Grid properties
    'grid-template-columns': 'grid-template',
    'grid-template-rows': 'grid-template',
    'grid-template-areas': 'grid-template',
    'grid-column': 'grid',
    'grid-row': 'grid',
    'grid-area': 'grid',
    'justify-items': 'justify-items',
    'grid-auto-columns': 'grid-auto',
    'grid-auto-rows': 'grid-auto',
    'grid-auto-flow': 'grid-auto',
    gap: 'gap',
    'row-gap': 'gap',
    'column-gap': 'gap',

    // Typography properties
    'font-family': 'font',
    'font-size': 'font',
    'font-weight': 'font',
    'font-style': 'font',
    'line-height': 'line-height',
    'letter-spacing': 'letter-spacing',
    'text-align': 'text',
    'text-decoration': 'text',
    'text-transform': 'text',
    'text-shadow': 'text',
    'white-space': 'white-space',
    'word-break': 'word-break',
    'word-wrap': 'word-wrap',
    'overflow-wrap': 'overflow-wrap',

    // Animation properties
    animation: 'animation',
    'animation-name': 'animation',
    'animation-duration': 'animation',
    'animation-timing-function': 'animation',
    'animation-delay': 'animation',
    'animation-iteration-count': 'animation',
    'animation-direction': 'animation',
    'animation-fill-mode': 'animation',
    'animation-play-state': 'animation',
    transition: 'transition',
    'transition-property': 'transition',
    'transition-duration': 'transition',
    'transition-timing-function': 'transition',
    'transition-delay': 'transition',
    transform: 'transform',
    'transform-origin': 'transform',
    'transform-style': 'transform',
    perspective: 'perspective',
    'perspective-origin': 'perspective',
    'backface-visibility': 'backface-visibility',
    'will-change': 'will-change',
};

// CSS optimization functions
export class CSSOptimizer {
    private static instance: CSSOptimizer;

    static getInstance(): CSSOptimizer {
        if (!CSSOptimizer.instance) {
            CSSOptimizer.instance = new CSSOptimizer();
        }
        return CSSOptimizer.instance;
    }

    /**
     * Optimize CSS by removing unused classes and properties
     */
    optimizeCSS(css: string, usedClasses: Set<string>): string {
        let optimizedCSS = css;

        // Remove unused classes
        optimizedCSS = this.removeUnusedClasses(optimizedCSS, usedClasses);

        // Optimize properties
        optimizedCSS = this.optimizeProperties(optimizedCSS);

        // Remove empty rules
        optimizedCSS = this.removeEmptyRules(optimizedCSS);

        // Minify CSS
        optimizedCSS = this.minifyCSS(optimizedCSS);

        return optimizedCSS;
    }

    /**
     * Extract critical CSS for above-the-fold content
     */
    extractCriticalCSS(css: string, criticalSelectors: string[]): string {
        const lines = css.split('\n');
        const criticalCSS: string[] = [];
        let inCriticalRule = false;

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Check if this line starts a critical rule
            for (const selector of criticalSelectors) {
                if (
                    trimmedLine.includes(selector) &&
                    trimmedLine.includes('{')
                ) {
                    inCriticalRule = true;
                    break;
                }
            }

            if (inCriticalRule) {
                criticalCSS.push(line);

                // Check if this line ends the rule
                if (trimmedLine.includes('}')) {
                    inCriticalRule = false;
                }
            }
        }

        return criticalCSS.join('\n');
    }

    /**
     * Remove unused CSS classes
     */
    private removeUnusedClasses(css: string, usedClasses: Set<string>): string {
        let optimizedCSS = css;

        // Remove unused utility classes
        for (const className of PURGEABLE_CLASSES) {
            if (!usedClasses.has(className)) {
                const regex = new RegExp(
                    `\\.${className.replace(/\*/g, '.*')}\\s*\\{[^}]*\\}`,
                    'g'
                );
                optimizedCSS = optimizedCSS.replace(regex, '');
            }
        }

        return optimizedCSS;
    }

    /**
     * Optimize CSS properties by using shorthand notation
     */
    private optimizeProperties(css: string): string {
        let optimizedCSS = css;

        // This is a simplified version - in a real implementation,
        // you would use a proper CSS parser like postcss
        for (const [longhand, shorthand] of Object.entries(
            OPTIMIZABLE_PROPERTIES
        )) {
            // This would need more sophisticated logic to properly optimize
            // CSS properties without breaking the stylesheet
        }

        return optimizedCSS;
    }

    /**
     * Remove empty CSS rules
     */
    private removeEmptyRules(css: string): string {
        return css.replace(/\{[^}]*\}/g, (match) => {
            const content = match.slice(1, -1).trim();
            return content ? match : '';
        });
    }

    /**
     * Minify CSS by removing unnecessary whitespace and comments
     */
    private minifyCSS(css: string): string {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
            .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
            .replace(/\s*}\s*/g, '}') // Remove spaces around closing brace
            .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
            .replace(/\s*,\s*/g, ',') // Remove spaces around commas
            .replace(/\s*:\s*/g, ':') // Remove spaces around colons
            .trim();
    }

    /**
     * Generate CSS custom properties for theme switching
     */
    generateThemeCSS(theme: 'light' | 'dark'): string {
        const lightTheme = {
            '--background': 'oklch(1 0 0)',
            '--foreground': 'oklch(0.145 0 0)',
            '--card': 'oklch(1 0 0)',
            '--card-foreground': 'oklch(0.145 0 0)',
            '--popover': 'oklch(1 0 0)',
            '--popover-foreground': 'oklch(0.145 0 0)',
            '--primary': 'oklch(0.205 0 0)',
            '--primary-foreground': 'oklch(0.985 0 0)',
            '--secondary': 'oklch(0.97 0 0)',
            '--secondary-foreground': 'oklch(0.205 0 0)',
            '--muted': 'oklch(0.97 0 0)',
            '--muted-foreground': 'oklch(0.556 0 0)',
            '--accent': 'oklch(0.97 0 0)',
            '--accent-foreground': 'oklch(0.205 0 0)',
            '--destructive': 'oklch(0.577 0.245 27.325)',
            '--border': 'oklch(0.922 0 0)',
            '--input': 'oklch(0.922 0 0)',
            '--ring': 'oklch(0.708 0 0)',
        };

        const darkTheme = {
            '--background': 'oklch(0.145 0 0)',
            '--foreground': 'oklch(0.985 0 0)',
            '--card': 'oklch(0.205 0 0)',
            '--card-foreground': 'oklch(0.985 0 0)',
            '--popover': 'oklch(0.205 0 0)',
            '--popover-foreground': 'oklch(0.985 0 0)',
            '--primary': 'oklch(0.922 0 0)',
            '--primary-foreground': 'oklch(0.205 0 0)',
            '--secondary': 'oklch(0.269 0 0)',
            '--secondary-foreground': 'oklch(0.985 0 0)',
            '--muted': 'oklch(0.269 0 0)',
            '--muted-foreground': 'oklch(0.708 0 0)',
            '--accent': 'oklch(0.269 0 0)',
            '--accent-foreground': 'oklch(0.985 0 0)',
            '--destructive': 'oklch(0.704 0.191 22.216)',
            '--border': 'oklch(1 0 0 / 10%)',
            '--input': 'oklch(1 0 0 / 15%)',
            '--ring': 'oklch(0.556 0 0)',
        };

        const themeVars = theme === 'light' ? lightTheme : darkTheme;
        const selector = theme === 'light' ? ':root' : '.dark';

        const cssVars = Object.entries(themeVars)
            .map(([key, value]) => `  ${key}: ${value};`)
            .join('\n');

        return `${selector} {\n${cssVars}\n}`;
    }
}

// Export singleton instance
export const cssOptimizer = CSSOptimizer.getInstance();
