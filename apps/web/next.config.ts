import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	experimental: {
		useCache: true,
	},
	cacheLife: {
		seconds: {
			stale: 0,
			revalidate: 1,
			expire: 1,
		},
		minutes: {
			stale: 300,
			revalidate: 60,
			expire: 3600,
		},
		hours: {
			stale: 300,
			revalidate: 3600,
			expire: 86400,
		},
		days: {
			stale: 300,
			revalidate: 86400,
			expire: 604800,
		},
		agents: {
			stale: 60,
			revalidate: 300,
			expire: 3600,
		},
	},
};

export default nextConfig;
