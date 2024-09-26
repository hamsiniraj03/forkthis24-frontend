const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "jersey": ['"Jersey 20"', "monospace"],
        "roboto-slab": ['"Roboto Slab"', "monospace"],
        "roboto-mono": ['"Roboto Mono"', "monospace"],
        "bungee": ['"Bungee"', "monospace"],
        "cantora": ['"Cantora One"', "monospace"],
        
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
