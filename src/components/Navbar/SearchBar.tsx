"use client";

import { useRouter } from "next/navigation";

import { Button, Input } from "@nextui-org/react";

import { Search } from "lucide-react";
import { type MouseEvent, useRef, useTransition } from "react";

export const SearchBar = () => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	const [isLoading, startTransition] = useTransition();

	const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (inputRef.current?.value === "") return;

		const searchQuery = new URLSearchParams();
		searchQuery.set("query", inputRef.current!.value);

		router.push("/search?" + searchQuery.toString());
	};

	return (
		<form className="group flex w-max">
			<div className="w-40">
				<Input
					radius="lg"
					isClearable
					ref={inputRef}
					labelPlacement="outside"
					placeholder="Tìm kiếm"
					type="text"
					name="query"
					classNames={{ inputWrapper: "rounded-r-none" }}
				/>
			</div>

			<Button
				isIconOnly
				className="rounded-l-none"
				type="submit"
				startContent={!isLoading ? <Search size={20} /> : null}
				isLoading={isLoading}
				onClick={(e) => {
					e.preventDefault();
					startTransition(() => handleSubmit(e));
				}}
			/>
		</form>
	);
};
