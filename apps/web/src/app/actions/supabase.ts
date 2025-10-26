"use server";

import { cacheLife, cacheTag, revalidateTag, updateTag } from "next/cache";
import { createServerClient } from "@/lib/supabase";

type Template = {
	id?: string;
	name: string;
	content?: string;
	[key: string]: unknown;
};

export async function getComponentTemplates() {
	"use cache";
	cacheTag("component-templates");
	cacheLife("hours");

	const supabase = createServerClient();
	const { data, error } = await supabase
		.from("templates")
		.select("*")
		.order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data as Template[];
}

export async function upsertComponentTemplate(template: Template) {
	const supabase = createServerClient();
	const { error } = await supabase
		.from("templates")
		.upsert(template)
		.select("id")
		.single();
	if (error) throw new Error(error.message);
	updateTag("component-templates");
	return { ok: true };
}

export async function deleteComponentTemplate(id: string) {
	const supabase = createServerClient();
	const { error } = await supabase.from("templates").delete().eq("id", id);
	if (error) throw new Error(error.message);
	revalidateTag("component-templates", "hours");
	return { ok: true };
}
