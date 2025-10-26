/**
 * Home Page - Live Steam App
 *
 * This is the main page that displays the AI agent chat interface
 * and agent-generated content.
 */

"use client";

import { useState } from "react";
import { CopilotChatComponent } from "@/components/copilot-chat";

export default function Home() {
	const [generatedComponents, setGeneratedComponents] = useState<unknown[]>([]);
	const [agentMessages, setAgentMessages] = useState<unknown[]>([]);

	return (
		<main className="flex min-h-screen w-full flex-col">
			{/* Header */}
			<header className="border-gray-200 border-b bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm">
				<div className="mx-auto max-w-7xl">
					<h1 className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text font-bold text-3xl text-transparent">
						🚀 Live Steam App
					</h1>
					<p className="mt-1 text-gray-600">
						AI-powered agent orchestration with real-time component generation
					</p>
				</div>
			</header>

			{/* Main Content */}
			<div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6">
				{/* Chat Section */}
				<div className="min-h-96 flex-1">
					<h2 className="mb-4 font-semibold text-gray-900 text-xl">
						Agent Chat
					</h2>
					<CopilotChatComponent
						onComponentGenerated={(component) => {
							setGeneratedComponents((prev) => [...prev, component]);
						}}
						onAgentMessage={(message) => {
							setAgentMessages((prev) => [...prev, message]);
						}}
					/>
				</div>

				{/* Generated Components Display */}
				{generatedComponents.length > 0 && (
					<div className="mt-6">
						<h2 className="mb-4 font-semibold text-gray-900 text-xl">
							Generated Components ({generatedComponents.length})
						</h2>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{generatedComponents.map((component, idx) => (
								<div
									key={component.id || `generated-${idx}`}
									className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
								>
									<h3 className="mb-2 font-semibold text-gray-900">
										{component.name}
									</h3>
									<p className="mb-3 text-gray-500 text-sm">
										Type: {component.type || "component"}
									</p>
									<pre className="max-h-40 overflow-auto rounded border border-gray-200 bg-gray-50 p-2 text-xs">
										<code>{component.code?.substring(0, 200)}...</code>
									</pre>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Agent Communication Log */}
				{agentMessages.length > 0 && (
					<div className="mt-6">
						<h2 className="mb-4 font-semibold text-gray-900 text-xl">
							Agent Communications ({agentMessages.length})
						</h2>
						<div className="max-h-64 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-gray-100 text-sm">
							{agentMessages.map((msg, idx) => (
								<div
									key={msg.id || `agent-msg-${idx}`}
									className="mb-2 border-gray-700 border-b pb-2"
								>
									<span className="text-blue-400">{msg.agent}:</span>
									<span className="ml-2 text-gray-300">{msg.task}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="mt-auto border-gray-200 border-t bg-white/80 px-6 py-4 backdrop-blur-sm">
				<div className="mx-auto max-w-7xl text-center text-gray-600 text-sm">
					<p>
						Powered by A2A Protocol, AG-UI, CopilotKit, Google ADK, and
						LangGraph
					</p>
					<p className="mt-1">
						<a
							href="https://docs.copilotkit.ai"
							className="text-blue-600 hover:underline"
						>
							Documentation
						</a>
						{" • "}
						<a
							href="https://github.com"
							className="text-blue-600 hover:underline"
						>
							GitHub
						</a>
					</p>
				</div>
			</footer>
		</main>
	);
}
