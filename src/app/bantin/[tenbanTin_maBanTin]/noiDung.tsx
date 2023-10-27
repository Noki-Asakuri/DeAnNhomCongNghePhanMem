"use client";

import NextLink from "next/link";

import { api } from "@/utils/trpc/react";

import { useTimeoutFn } from "react-use";
import { Image, Link } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";

export const NoiDung = ({ maBanTin, children }: { maBanTin: string; children: string }) => {
	const markAsRead = api.banTin.markAsRead.useMutation();

	useTimeoutFn(() => {
		markAsRead.mutate({ maBanTin });
	}, 5000);

	return (
		<ReactMarkdown
			className="[&>p]:pb-5"
			components={{
				a: ({ children, href }) => (
					<Link as={NextLink} underline="hover" href={href} target={"_blank"}>
						{children}
					</Link>
				),
				img: ({ node: _node, alt, src, ..._prop }) => (
					<span className="flex flex-col gap-y-2">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<Image removeWrapper src={src} alt={alt} />
						<span className="text-sm text-gray-600 dark:text-gray-300">{alt}</span>
					</span>
				),
			}}
		>
			{children}
		</ReactMarkdown>
	);
};
