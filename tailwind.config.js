/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "custom-bg": "url('./assets/home-bg.png')",
            },
        },
        fontFamily: {
            inter: ["Inter", "sans-serif"], // Adding Inter as a custom font family
        },
    },

    plugins: [],
}
