import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

export async function GET() {
	"use cache";
	cacheTag("agent-stats");
	cacheLife("agents");

	try {
		const [orchestratorRes, builderRes] = await Promise.all([
			fetch("http://localhost:8001/api/stats").catch(() => null),
			fetch("http://localhost:8002/api/stats").catch(() => null),
		]);

		const orchestratorStats = orchestratorRes?.ok
			? await orchestratorRes.json()
			: { status: "offline", error: "Failed to connect" };

		const builderStats = builderRes?.ok
			? await builderRes.json()
			: { status: "offline", error: "Failed to connect" };

		return Response.json({
			timestamp: new Date().toISOString(),
			orchestrator: orchestratorStats,
			componentBuilder: builderStats,
			cacheInfo: {
				profile: "agents",
				revalidatesIn: "5 minutes",
				expiresIn: "1 hour",
			},
		});
	} catch (error) {
		console.error("Error fetching agent stats:", error);
		return Response.json(
			{ error: "Failed to fetch agent statistics" },
			{ status: 500 },
		);
	}
}
