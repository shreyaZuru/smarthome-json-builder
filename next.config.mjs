const nextConfig = {
  webpack(config) {
    config.module.rules.forEach((rule) => {
      if (rule?.loader?.includes("next-image-loader")) {
        rule.exclude = /\.svg$/i;
      }
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    disableStaticImages: true,
  },
};

export default nextConfig;
