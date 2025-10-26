import { CopilotKit } from "@copilotkit/react-core";
import type { Metadata } from "next";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "Live Steam App",
	description:
		"AI-powered live streaming application with agent-driven components",
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				{/* CopilotKit Provider - Wraps the entire app */}
				{/* This enables agent communication for all child components */}
				<CopilotKit
					// Backend endpoint for agent communication
					runtimeUrl="/api/copilotkit"
					// Specify A2A agent protocol
					agent="a2a_chat"
					// Show dev console in development (helpful for debugging)
					showDevConsole={process.env.NODE_ENV === "development"}
				>
					{/* Your app content */}
					{children}
				</CopilotKit>
			</body>
		</html>
	);
}
