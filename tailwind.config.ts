import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'food-orange': '#ff6b35',
                'food-red': '#ff4757',
                'food-green': '#4ade80',
                'food-yellow': '#fbbf24',
                'food-cream': '#faf8f5',
                'food-dark': '#1a1a1a',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.5)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
