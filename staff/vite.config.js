import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  extend: {
    animation: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
      scaleIn: 'scaleIn 0.3s ease-in-out',
      modalSlide: 'modalSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      shimmer: 'shimmer 2s linear infinite',
      'pulse-once': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) 1',
      wiggle: 'wiggle 1s ease-in-out',
      slideInFromTop: 'slideInFromTop 0.5s forwards',
      slideInFromBottom: 'slideInFromBottom 0.5s forwards',
      slideInFromLeft: 'slideInFromLeft 0.5s forwards',
      slideInFromRight: 'slideInFromRight 0.5s forwards',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      scaleIn: {
        '0%': { transform: 'scale(0.9)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
      modalSlide: {
        '0%': { 
          transform: 'translate(0, 50px) scale(0.95)', 
          opacity: 0 
        },
        '100%': { 
          transform: 'translate(0, 0) scale(1)', 
          opacity: 1 
        },
      },
      shimmer: {
        '0%': { backgroundPosition: '-1000px 0' },
        '100%': { backgroundPosition: '1000px 0' },
      },
      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      slideInFromTop: {
        '0%': { transform: 'translateY(-100%)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      slideInFromBottom: {
        '0%': { transform: 'translateY(100%)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      slideInFromLeft: {
        '0%': { transform: 'translateX(-100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      slideInFromRight: {
        '0%': { transform: 'translateX(100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      slideInDown: {
        '0%': { transform: 'translateY(-10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      slideInUp: {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      widthGrow: {
        '0%': { width: '0%' },
        '100%': { width: '100%' },
      }
    },
  }
})
