/*
 * MIT License
 *
 * Copyright (c) 2022 Aime Biendo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {IntId, StringId} from '../src/version';

describe('Describe StringId implementation', () => {
    describe('Describe StringId.', () => {
        it('Should construct a string id.', () => {
            const stringId: StringId = new StringId('0A.is.legal');
            expect(stringId).toBeDefined();
        });
        it('Should check snapshot.', () => {
            const stringId1: StringId = new StringId('0A.SNAPSHOT');
            expect(stringId1.isSnapshot).toBeTruthy();
            const stringId2: StringId = new StringId('12+meta');
            expect(stringId2.isSnapshot).toBeFalsy();
        });
        it('Should compare to other StringId.', () => {
            const stringId1: StringId = new StringId('0-alpha');
            const stringId2: StringId = new StringId('1-alpha');
            expect(stringId1.compareTo(stringId2)).toBe(-1);
            expect(stringId2.compareTo(stringId1)).toBe(1);
            expect(stringId1.compareTo(stringId1)).toBe(0);
            expect(stringId2.compareTo(stringId2)).toBe(0);
            expect(stringId1.compareTo(new IntId(34))).toBe(1);
        });
        it('Should check equality to other StringId.', () => {
            const stringId1: StringId = new StringId('0-alpha');
            const stringId2: StringId = new StringId('1-alpha');
            expect(stringId1.equals([])).toBeFalsy();
            expect(stringId1.equals(stringId2)).toBeFalsy();
            expect(stringId2.equals(stringId1)).toBeFalsy();
            expect(stringId1.equals(stringId1)).toBeTruthy();
            expect(stringId2.equals(stringId2)).toBeTruthy();
        });
        it('Should clone a StringId.', () => {
            const stringId1: StringId = new StringId('0-alpha');
            const stringId2: StringId = stringId1.clone() as StringId;
            expect(stringId1.equals(stringId2)).toBeTruthy();
            expect(stringId1.compareTo(stringId2)).toBe(0);
        });
        it('Should release a StringId.', () => {
            const stringId1: StringId = new StringId('0-alpha');
            expect(stringId1.toString()).toBe('0-alpha');
            stringId1.finalize();
            expect(stringId1.toString()).toBe('');
        });
    });
});