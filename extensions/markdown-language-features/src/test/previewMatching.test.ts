/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import 'mocha';
import { DynamicPreviewMatchInfo, dynamicPreviewsMatch } from '../preview/previewMatching';

const following: DynamicPreviewMatchInfo = { viewColumn: 1, locked: false, sourceBound: false };
const locked: DynamicPreviewMatchInfo = { viewColumn: 1, locked: true, sourceBound: false };
const bound: DynamicPreviewMatchInfo = { viewColumn: 1, locked: false, sourceBound: true };

const sameResource = () => true;
const otherResource = () => false;

suite('dynamicPreviewsMatch', () => {
	test('Previews in different editor groups never match', () => {
		for (const info of [following, locked, bound]) {
			assert.strictEqual(dynamicPreviewsMatch(info, { ...info, viewColumn: 2 }, sameResource), false);
		}
	});

	test('Previews that follow the active editor are shared per editor group', () => {
		assert.strictEqual(dynamicPreviewsMatch(following, following, otherResource), true);
		assert.strictEqual(dynamicPreviewsMatch(following, following, sameResource), true);
	});

	test('Source bound previews only match previews of the same document', () => {
		assert.strictEqual(dynamicPreviewsMatch(bound, bound, sameResource), true);
		assert.strictEqual(dynamicPreviewsMatch(bound, bound, otherResource), false);
	});

	test('Locked previews only match previews of the same document', () => {
		assert.strictEqual(dynamicPreviewsMatch(locked, locked, sameResource), true);
		assert.strictEqual(dynamicPreviewsMatch(locked, locked, otherResource), false);
	});

	test('Locked and source bound previews of the same document match', () => {
		assert.strictEqual(dynamicPreviewsMatch(locked, bound, sameResource), true);
		assert.strictEqual(dynamicPreviewsMatch(bound, locked, sameResource), true);
		assert.strictEqual(dynamicPreviewsMatch(locked, bound, otherResource), false);
	});

	test('Previews that follow the active editor never match locked or source bound previews', () => {
		for (const info of [locked, bound]) {
			assert.strictEqual(dynamicPreviewsMatch(following, info, sameResource), false);
			assert.strictEqual(dynamicPreviewsMatch(info, following, sameResource), false);
		}
	});
});
