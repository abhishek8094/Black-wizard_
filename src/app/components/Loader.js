"use client"
import React from "react";

export default function Loader({ show = false, label = "Loading..." }) {
	if (!show) return null;
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="flex flex-col items-center gap-4 rounded-xl bg-white px-8 py-6 shadow-2xl">
				<div className="relative h-12 w-12">
					<div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
					<div className="absolute inset-2 animate-ping rounded-full bg-gray-900/10"></div>
				</div>
				<div className="text-sm font-medium text-gray-800">{label}</div>
			</div>
		</div>
	);
}
