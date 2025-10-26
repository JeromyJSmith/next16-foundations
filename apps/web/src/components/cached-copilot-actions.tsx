import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";

interface CachedAction {
	id: string;
	name: string;
	description: string;
	parameters: Array<{
		name: string;
		type: string;
		description: string;
	}>;
}

export async function fetchAvailableActions(): Promise<CachedAction[]> {
	"use cache";
	cacheTag("copilot-actions");
	cacheLife("hours");

	try {
		const response = await fetch("http://localhost:8001/api/actions", {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.error("Failed to fetch copilot actions");
			return [];
		}

		return response.json();
	} catch (error) {
		console.error("Error fetching copilot actions:", error);
		return [];
	}
}

export async function fetchAgentCapabilities(agentName: string): Promise<{
	name: string;
	capabilities: string[];
	status: "online" | "offline";
	version: string;
}> {
	"use cache";
	cacheTag(`agent-capabilities-${agentName}`);
	cacheLife("agents");

	try {
		const response = await fetch(
			`http://localhost:8001/api/agents/${agentName}/capabilities`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			return {
				name: agentName,
				capabilities: [],
				status: "offline",
				version: "unknown",
			};
		}

		return response.json();
	} catch (error) {
		console.error(`Error fetching ${agentName} capabilities:`, error);
		return {
			name: agentName,
			capabilities: [],
			status: "offline",
			version: "unknown",
		};
	}
}

export async function fetchComponentTemplates(category?: string): Promise<
	Array<{
		id: string;
		name: string;
		category: string;
		preview: string;
		code: string;
	}>
> {
	"use cache";
	cacheTag("component-templates");
	cacheLife("hours");

	try {
		const query = new URLSearchParams();
		if (category) {
			query.set("category", category);
		}

		const response = await fetch(
			`http://localhost:8002/api/templates?${query.toString()}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			return [];
		}

		return response.json();
	} catch (error) {
		console.error("Error fetching component templates:", error);
		return [];
	}
}

interface GeneratedComponent {
	id: string;
	name: string;
	code: string;
	generatedAt: string;
	agent: string;
}

export async function fetchGeneratedComponents(
	limit = 10,
): Promise<GeneratedComponent[]> {
	"use cache";
	cacheTag("generated-components");
	cacheLife("minutes");

	try {
		const response = await fetch(
			`http://localhost:8002/api/generated?limit=${limit}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			return [];
		}

		return response.json();
	} catch (error) {
		console.error("Error fetching generated components:", error);
		return [];
	}
}

export async function fetchOrchestratorMetrics(): Promise<{
	totalAgents: number;
	activeAgents: number;
	tasksQueued: number;
	tasksCompleted: number;
	averageTaskDuration: number;
}> {
	"use cache";
	cacheTag("orchestrator-metrics");
	cacheLife("agents");

	try {
		const response = await fetch("http://localhost:8001/api/metrics", {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch metrics");
		}

		return response.json();
	} catch (error) {
		console.error("Error fetching orchestrator metrics:", error);
		return {
			totalAgents: 0,
			activeAgents: 0,
			tasksQueued: 0,
			tasksCompleted: 0,
			averageTaskDuration: 0,
		};
	}
}

export async function getCachedLLMContextWindow(
	modelName: string,
): Promise<number> {
	"use cache";
	cacheTag(`llm-context-${modelName}`);
	cacheLife("days");

	const contextWindows: Record<string, number> = {
		"gpt-4-turbo": 128000,
		"gpt-4": 8192,
		"gpt-3.5-turbo": 4096,
		"claude-3-opus": 200000,
		"claude-3-sonnet": 200000,
		"claude-3-haiku": 200000,
		"gemini-pro": 32000,
	};

	return contextWindows[modelName] || 4096;
}
