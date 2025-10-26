/**
 * Copilot Chat Component
 *
 * This component provides the main chat interface for agent communication.
 * It displays messages, agent interactions, and results in real-time.
 */

"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";
import styles from "./copilot-chat.module.css";

/**
 * Props for the CopilotChat component
 */
interface CopilotChatProps {
	onComponentGenerated?: (component: unknown) => void;
	onAgentMessage?: (message: unknown) => void;
	className?: string;
}

/**
 * Main Copilot Chat Component
 *
 * Features:
 * - Real-time agent-to-agent (A2A) communication visualization
 * - Generative UI rendering of agent responses
 * - Message history and conversation management
 * - Support for Human-in-the-Loop (HITL) workflows
 * - Streaming agent responses
 */
export function CopilotChatComponent({
	onComponentGenerated,
	onAgentMessage,
	className,
}: CopilotChatProps) {
	const [_visibleMessages, _setVisibleMessages] = useState<unknown[]>([]);

	/**
	 * Register A2A communication action
	 *
	 * This action visualizes when the orchestrator sends messages
	 * to specialized A2A agents and displays their responses.
	 */
	useCopilotAction({
		name: "send_message_to_a2a_agent",
		description: "Sends a message to an A2A agent (Component Builder, etc.)",
		parameters: [
			{
				name: "agentName",
				type: "string",
				description: "The name of the A2A agent to send the message to",
			},
			{
				name: "task",
				type: "string",
				description: "The message/task to send to the A2A agent",
			},
		],
		render: (actionRenderProps: unknown) => (
			<A2AMessageVisualization
				{...actionRenderProps}
				onMessage={onAgentMessage}
			/>
		),
	});

	/**
	 * Register component generation action
	 *
	 * When agents generate React components, this renders them
	 * in the chat UI for live preview and interaction.
	 */
	useCopilotAction({
		name: "display_generated_component",
		description: "Displays a generated React component in the chat",
		parameters: [
			{
				name: "componentName",
				type: "string",
				description: "Name of the component",
			},
			{
				name: "componentCode",
				type: "string",
				description: "The generated component TypeScript code",
			},
		],
		render: (actionRenderProps: unknown) => (
			<ComponentPreview
				{...actionRenderProps}
				onGenerated={onComponentGenerated}
			/>
		),
	});

	return (
		<div className={`${styles.chatContainer} ${className || ""}`}>
			<CopilotChat className={styles.chat} />
		</div>
	);
}

/**
 * A2A Message Visualization Component
 *
 * Shows incoming/outgoing messages between orchestrator and A2A agents
 * with visual indication of agent communication flow
 */
function A2AMessageVisualization({
	args,
	result,
	onMessage,
}: {
	args: unknown;
	result: unknown;
	onMessage: unknown;
}) {
	useEffect(() => {
		if (args || result) {
			onMessage?.({
				type: "a2a_communication",
				agent: args?.agentName,
				task: args?.task,
				result,
			});
		}
	}, [args, result, onMessage]);

	return (
		<div className={styles.a2aMessage}>
			<div className={styles.outgoing}>
				<div className={styles.agentBadge}>→ {args?.agentName}</div>
				<div className={styles.taskBox}>{args?.task}</div>
			</div>

			{result && (
				<div className={styles.incoming}>
					<div className={styles.agentBadge}>← {args?.agentName}</div>
					<div className={styles.resultBox}>{result}</div>
				</div>
			)}
		</div>
	);
}

/**
 * Component Preview Component
 *
 * Renders generated React components in the chat for live preview
 */
function ComponentPreview({
	args,
	respond,
	onGenerated,
}: {
	args: unknown;
	respond: unknown;
	onGenerated: unknown;
}) {
	const [showCode, setShowCode] = useState(false);

	useEffect(() => {
		if (args?.componentCode) {
			onGenerated?.({
				name: args.componentName,
				code: args.componentCode,
			});
		}
	}, [args, onGenerated]);

	return (
		<div className={styles.componentPreview}>
			<div className={styles.componentHeader}>
				<h3>{args?.componentName}</h3>
				<button
					type="button"
					onClick={() => setShowCode(!showCode)}
					className={styles.toggleButton}
				>
					{showCode ? "Hide Code" : "Show Code"}
				</button>
			</div>

			{showCode && (
				<pre className={styles.codeBlock}>
					<code>{args?.componentCode}</code>
				</pre>
			)}

			<div className={styles.componentActions}>
				<button
					type="button"
					onClick={() => respond?.({ action: "accept" })}
					className={`${styles.button} ${styles.primary}`}
				>
					Use Component
				</button>
				<button
					type="button"
					onClick={() => respond?.({ action: "regenerate" })}
					className={`${styles.button} ${styles.secondary}`}
				>
					Regenerate
				</button>
			</div>
		</div>
	);
}
