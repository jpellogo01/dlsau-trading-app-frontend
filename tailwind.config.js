/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Exact De La Salle Araneta University Colors
                'araneta': {
                    green: {
                        DEFAULT: '#00733F',
                        50: '#f0f9f4',
                        100: '#d4f0de',
                        200: '#a8e1c5',
                        300: '#7cd2ac',
                        400: '#4dc494',
                        500: '#00733F', // Primary Green
                        600: '#006032',
                        700: '#004d27',
                        800: '#003a1e',
                        900: '#002714',
                        950: '#00120a',
                    },
                    gold: {
                        DEFAULT: '#FFD700',
                        50: '#fffecc',
                        100: '#fff9b8',
                        200: '#fff3a3',
                        300: '#ffed8e',
                        400: '#ffe67a',
                        500: '#FFD700', // Gold
                        600: '#ccad00',
                        700: '#998300',
                        800: '#665900',
                        900: '#334200',
                        950: '#001000',
                    },
                    'light-green': {
                        DEFAULT: '#A7D49B',
                        50: '#f1f8f0',
                        100: '#d9eee2',
                        200: '#c0e4d2',
                        300: '#a8d9c3',
                        400: '#8fceb4',
                        500: '#A7D49B', // Soft Light Green
                        600: '#87b384',
                        700: '#678a6d',
                        800: '#466156',
                        900: '#25383f',
                        950: '#051f18',
                    },
                    orange: {
                        DEFAULT: '#FF8C42',
                        50: '#fff8f2',
                        100: '#ffede2',
                        200: '#ffddd2',
                        300: '#ffccbf',
                        400: '#ffbbac',
                        500: '#FF8C42', // Warm Orange
                        600: '#cc6f34',
                        700: '#995227',
                        800: '#66351a',
                        900: '#33190d',
                        950: '#190a04',
                    },
                },
                // Neutrals for light theme
                neutral: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#020617',
                },
                dark: '#333333', // Dark text
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glow-green': '0 0 0 1px rgb(0 115 63 / 0.5), 0 0 0 5px rgb(0 115 63 / 0.25)',
                'glow-gold': '0 0 0 1px rgb(255 215 0 / 0.5), 0 0 0 5px rgb(255 215 0 / 0.25)',
                glass: '0 25px 50px -12px rgba(0 0 0 0.1)',
            },
            borderRadius: {
                extra: '1.5rem',
                mega: '2.5rem',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

