"use server";

import { revalidateTag, updateTag } from "next/cache";

// Generic helpers
export async function revalidateByTag(
	tag: string,
	profile: string | { expire?: number },
) {
	revalidateTag(tag, profile);
}

export async function updateByTag(tag: string) {
	updateTag(tag);
}

// Orchestrator-related
export async function revalidateAgentStats() {
	revalidateTag("agent-stats", "agents");
}

export async function revalidateOrchestratorStatus() {
	revalidateTag("orchestrator-status", "agents");
}

export async function revalidateOrchestratorMetrics() {
	revalidateTag("orchestrator-metrics", "agents");
}

export async function revalidateAgentCapabilities(agentName: string) {
	revalidateTag(`agent-capabilities-${agentName}`, "agents");
}

// Component builder / templates
export async function revalidateComponentTemplates() {
	revalidateTag("component-templates", "hours");
}

export async function revalidateGeneratedComponents() {
	revalidateTag("generated-components", "minutes");
}

// Immediate updates (read-your-writes)
export async function updateComponentTemplates() {
	updateTag("component-templates");
}

export async function updateGeneratedComponents() {
	updateTag("generated-components");
}

export async function updateAgentCapabilities(agentName: string) {
	updateTag(`agent-capabilities-${agentName}`);
}
