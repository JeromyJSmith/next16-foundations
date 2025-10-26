import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { Suspense } from "react";

interface OrchestratorStatus {
	uptime: number;
	activeAgents: string[];
	tasksCompleted: number;
	lastUpdated: string;
}

async function fetchOrchestratorStatus(): Promise<OrchestratorStatus> {
	"use cache";
	cacheTag("orchestrator-status");
	cacheLife("agents");

	try {
		const response = await fetch("http://localhost:8001/api/status", {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch orchestrator status");
		}

		return response.json();
	} catch (error) {
		console.error("Orchestrator status error:", error);
		return {
			uptime: 0,
			activeAgents: [],
			tasksCompleted: 0,
			lastUpdated: new Date().toISOString(),
		};
	}
}

async function OrchestratorStatusContent() {
	"use cache";
	cacheTag("orchestrator-status");
	cacheLife("agents");

	const status = await fetchOrchestratorStatus();

	return (
		<div className="rounded-lg border border-green-200 bg-green-50 p-4">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-green-900">Orchestrator Status</h3>
					<p className="mt-1 text-green-700 text-sm">
						✓ Running • {status.activeAgents.length} agents active
					</p>
				</div>
				<div className="text-right text-green-600 text-xs">
					<p>Tasks: {status.tasksCompleted}</p>
					<p>Uptime: {Math.round(status.uptime / 1000)}s</p>
				</div>
			</div>
		</div>
	);
}

export function AgentOrchestratorStatus() {
	return (
		<Suspense
			fallback={
				<div className="animate-pulse rounded-lg border border-gray-300 bg-gray-100 p-4">
					<div className="mb-2 h-4 w-1/3 rounded bg-gray-300" />
					<div className="h-3 w-1/2 rounded bg-gray-300" />
				</div>
			}
		>
			<OrchestratorStatusContent />
		</Suspense>
	);
}
