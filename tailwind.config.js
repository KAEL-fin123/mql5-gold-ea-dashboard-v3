/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        // 图表颜色
        chart: {
          '1': 'oklch(var(--chart-1) / <alpha-value>)',
          '2': 'oklch(var(--chart-2) / <alpha-value>)',
          '3': 'oklch(var(--chart-3) / <alpha-value>)',
          '4': 'oklch(var(--chart-4) / <alpha-value>)',
          '5': 'oklch(var(--chart-5) / <alpha-value>)',
        },
        // 侧边栏颜色
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar) / <alpha-value>)',
          foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
          primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
          accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'oklch(var(--border) / <alpha-value>)',
          ring: 'oklch(var(--ring) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      keyframes: {
        'animate-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'zoom-in': {
          from: {
            transform: 'scale(0.95)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
        'slide-down': {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'rank-1-glow': {
          '0%': {
            'box-shadow': '0 0 30px var(--rank-1-glow), 0 8px 32px rgba(0, 0, 0, 0.3)',
          },
          '100%': {
            'box-shadow': '0 0 40px var(--rank-1-glow), 0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
        'rank-2-glow': {
          '0%': {
            'box-shadow': '0 0 20px var(--rank-2-glow), 0 6px 24px rgba(0, 0, 0, 0.25)',
          },
          '100%': {
            'box-shadow': '0 0 25px var(--rank-2-glow), 0 8px 30px rgba(0, 0, 0, 0.3)',
          },
        },
        'rank-3-glow': {
          '0%': {
            'box-shadow': '0 0 15px var(--rank-3-glow), 0 4px 16px rgba(0, 0, 0, 0.2)',
          },
          '100%': {
            'box-shadow': '0 0 20px var(--rank-3-glow), 0 6px 20px rgba(0, 0, 0, 0.25)',
          },
        },
        'rank-badge-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
        },
        'metric-shine': {
          '0%, 100%': {
            filter: 'brightness(1)',
          },
          '50%': {
            filter: 'brightness(1.2)',
          },
        },
        'slide-in-from-side': {
          from: {
            opacity: '0',
            transform: 'translateX(100%)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: '0.3',
          },
          '50%': {
            opacity: '0.6',
          },
        },
      },
      animation: {
        'animate-in': 'animate-in 0.2s ease-out',
        'fade-in-0': 'fade-in 0.2s ease-out',
        'zoom-in-95': 'zoom-in 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'rank-1-glow': 'rank-1-glow 2s ease-in-out infinite alternate',
        'rank-2-glow': 'rank-2-glow 2.5s ease-in-out infinite alternate',
        'rank-3-glow': 'rank-3-glow 3s ease-in-out infinite alternate',
        'rank-badge-pulse': 'rank-badge-pulse 1.5s ease-in-out infinite',
        'metric-shine': 'metric-shine 2s ease-in-out infinite',
        'slide-in-from-side': 'slide-in-from-side 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
