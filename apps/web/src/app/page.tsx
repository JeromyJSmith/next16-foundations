/**
 * Home Page - Live Steam App
 *
 * This is the main page that displays the AI agent chat interface
 * and agent-generated content.
 */

"use client";

import { CopilotChatComponent } from "@/components/copilot-chat";
import { useState } from "react";

export default function Home() {
	const [generatedComponents, setGeneratedComponents] = useState<any[]>([]);
	const [agentMessages, setAgentMessages] = useState<any[]>([]);

	return (
		<main className="min-h-screen w-full flex flex-col">
			{/* Header */}
			<header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
						🚀 Live Steam App
					</h1>
					<p className="text-gray-600 mt-1">
						AI-powered agent orchestration with real-time component generation
					</p>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
				{/* Chat Section */}
				<div className="flex-1 min-h-96">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Chat</h2>
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
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Generated Components ({generatedComponents.length})
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{generatedComponents.map((component, idx) => (
								<div
									key={idx}
									className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
								>
									<h3 className="font-semibold text-gray-900 mb-2">
										{component.name}
									</h3>
									<p className="text-sm text-gray-500 mb-3">
										Type: {component.type || "component"}
									</p>
									<pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40 border border-gray-200">
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
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Agent Communications ({agentMessages.length})
						</h2>
						<div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm max-h-64 overflow-auto">
							{agentMessages.map((msg, idx) => (
								<div key={idx} className="mb-2 pb-2 border-b border-gray-700">
									<span className="text-blue-400">{msg.agent}:</span>
									<span className="ml-2 text-gray-300">{msg.task}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4 mt-auto">
				<div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
					<p>
						Powered by A2A Protocol, AG-UI, CopilotKit, Google ADK, and LangGraph
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
