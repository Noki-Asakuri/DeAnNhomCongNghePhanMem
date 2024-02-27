import { SearchContent } from "@/components/search/SearchContent";
import { api } from "@/utils/trpc/server";

import { Divider } from "@nextui-org/react";

type SearchParams = { searchParams: { query?: string; author?: string } };

export default async function SearchPage({ searchParams }: SearchParams) {
	const [banTin, categories, authors] = await Promise.all([
		api.banTin.searchBanTin.query({ pageNum: 1, perPage: 6, query: { value: searchParams.query } }),
		api.common.getCategories.query(),
		api.common.getAuthors.query(),
	]);

	return (
		<section className="container grid max-w-6xl flex-grow grid-cols-[3fr,1px,1fr] gap-x-4 pt-4">
			<SearchContent initialNews={banTin} categories={categories} authors={authors} />

			<Divider orientation="vertical" />

			<aside></aside>
		</section>
	);
}
