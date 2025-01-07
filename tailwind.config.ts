import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		keyframes: {
			fadeIn: {
			  '0%': { opacity: '0' },
			  '100%': { opacity: '1' },
			},
			marquee: {
				from: {
					transform: 'translateX(0)'
				},
				to: {
					transform: 'translateX(calc(-100% - var(--gap)))'
				}
			},
			'marquee-vertical': {
				from: {
					transform: 'translateY(0)'
				},
				to: {
					transform: 'translateY(calc(-100% - var(--gap)))'
				}
			}
		},
		animation: {
			fadeIn: 'fadeIn 1s ease-in-out',
			marquee: 'marquee var(--duration) infinite linear',
			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
		},
  		screens: {
  			'max-sm': {
  				max: '430px'
  			},
  			'mid-sm': {
  				min: '588px'
  			},
  			'mid2-sm': {
  				max: '800px'
  			}
  		},
  		fontSize: {
  			'7xl': '4.8rem',
  			'9xl': '8rem',
  			'10xl': '6.8rem'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			navy: '#111343',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			doner: [
  				'Doner',
  				'sans-serif'
  			],
  			donerText: [
  				'DonerText',
  				'serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
		}
	}
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".bg-checkered-pattern": {
          backgroundImage: `
            linear-gradient(45deg, #eae5d8 25%, transparent 25%, transparent 75%, #eae5d8 75%, #eae5d8),
            linear-gradient(45deg, #eae5d8 25%, transparent 25%, transparent 75%, #eae5d8 75%, #eae5d8)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        },
      });
    }),
      require("tailwindcss-animate")
],
} satisfies Config;
