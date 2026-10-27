/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface DynamicPreviewMatchInfo {
	readonly viewColumn: number | undefined;

	/**
	 * Explicitly locked by the user. Locked previews never follow the active editor.
	 */
	readonly locked: boolean;

	/**
	 * Opened in place for a specific document. Source bound previews never follow the active editor.
	 */
	readonly sourceBound: boolean;
}

/**
 * Should two dynamic previews be treated as the same preview?
 *
 * Previews that follow the active editor are shared per editor group. Previews that are
 * locked or bound to their source document are only the same if they show the same document.
 */
export function dynamicPreviewsMatch(
	a: DynamicPreviewMatchInfo,
	b: DynamicPreviewMatchInfo,
	isSameResource: () => boolean,
): boolean {
	if (a.viewColumn !== b.viewColumn) {
		return false;
	}

	const aFollowsEditor = !a.locked && !a.sourceBound;
	const bFollowsEditor = !b.locked && !b.sourceBound;
	if (aFollowsEditor || bFollowsEditor) {
		return aFollowsEditor && bFollowsEditor;
	}

	return isSameResource();
}
