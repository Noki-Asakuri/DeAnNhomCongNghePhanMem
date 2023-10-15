import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { prisma } from "@/server/db/prisma";

import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook } from "svix";

export async function POST(request: Request) {
	const payload = (await request.json()) as WebhookEvent;
	const headers = Object.fromEntries(request.headers);

	const wh = new Webhook(env.CLERK_SIGNING_KEY);

	try {
		wh.verify(JSON.stringify(payload), headers);
	} catch (err) {
		return NextResponse.json({ error: new Error(err as string).message }, { status: 400 });
	}

	const { type, data } = payload;

	switch (type) {
		case "user.created": {
			const main_email = data.email_addresses.filter((email) => email.id === data.primary_email_address_id)[0]!;

			const user = await prisma.taiKhoan.create({
				data: {
					MaTaiKhoan: data.id,
					AnhDaiDien: data.image_url,
					Email: main_email.email_address,
					Ho: data.last_name,
					Ten: data.first_name,
					TenTaiKhoan: data.username,
					NguoiDung: { create: { MaNguoiDung: data.id } },
				},
			});

			return NextResponse.json({ ...user });
		}

		case "user.deleted": {
			await prisma.taiKhoan.delete({ where: { MaTaiKhoan: data.id } });
			return NextResponse.json({ message: "Delete user with id = " + data.id });
		}

		case "user.updated": {
			const main_email = data.email_addresses.filter((email) => email.id === data.primary_email_address_id)[0]!;

			const user = await prisma.taiKhoan.update({
				where: { MaTaiKhoan: data.id },
				data: {
					AnhDaiDien: data.image_url,
					Email: main_email.email_address,
					Ho: data.last_name,
					Ten: data.first_name,
					TenTaiKhoan: data.username,
				},
			});

			return NextResponse.json({ ...user });
		}
	}
}
