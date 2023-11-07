import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn<T extends string>(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs)) as T;
}

export const ObjectKeys = <Obj extends Record<string, unknown>>(obj: Obj): (keyof Obj)[] => {
	return Object.keys(obj) as (keyof Obj)[];
};
