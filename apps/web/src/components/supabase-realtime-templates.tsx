"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@/lib/supabase";

type Props = {
	channel?: string;
	onChange?: (payload: unknown) => void;
};

export function SupabaseRealtimeTemplates({
	channel = "templates",
	onChange,
}: Props) {
	useEffect(() => {
		const supabase = createBrowserClient();
		const ch = supabase
			.channel(channel)
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "templates" },
				(payload) => {
					onChange?.(payload);
				},
			)
			.subscribe();

		return () => {
			ch.unsubscribe();
		};
	}, [channel, onChange]);

	return null;
}
