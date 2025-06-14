// pkgroll.config.mjs
export default {
  outDir: "dist",
  copy: [
    { from: "public", to: "public" },
    { from: "src/views", to: "views" },
  ],
};
