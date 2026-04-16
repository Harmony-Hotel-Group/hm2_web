// Utility function to truncate text to a specified length and add an ellipsis if it exceeds that length.
export function truncate(text: string, max = 100): string {
	return text.length > max ? text.slice(0, max) + "…" : text;
}
