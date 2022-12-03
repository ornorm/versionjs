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

describe('Describe IntId implementation', () => {
    describe('Describe IntId.', () => {
        it('Should construct a int id.', () => {
            const intId: IntId = new IntId(1);
            expect(intId).toBeDefined();
        });
        it('Should check snapshot.', () => {
            const intId1: IntId = new IntId(1);
            expect(intId1.isSnapshot).toBeFalsy();
            const intId2: IntId = new IntId(100);
            expect(intId2.isSnapshot).toBeFalsy();
        });
        it('Should compare to other IntId.', () => {
            const intId1: IntId = new IntId(0);
            const intId2: IntId = new IntId(1);
            expect(intId1.compareTo(intId2)).toBe(-1);
            expect(intId2.compareTo(intId1)).toBe(1);
            expect(intId1.compareTo(intId1)).toBe(0);
            expect(intId2.compareTo(intId2)).toBe(0);
            expect(intId1.compareTo(new StringId('0-alpha'))).toBe(-1);
        });
        it('Should check equality to other IntId.', () => {
            const intId1: IntId = new IntId(0);
            const intId2: IntId = new IntId(1);
            expect(intId1.equals([])).toBeFalsy();
            expect(intId1.equals(intId2)).toBeFalsy();
            expect(intId2.equals(intId1)).toBeFalsy();
            expect(intId1.equals(intId1)).toBeTruthy();
            expect(intId2.equals(intId2)).toBeTruthy();
        });
        it('Should clone a IntId.', () => {
            const intId1: IntId = new IntId(0);
            const intId2: IntId = intId1.clone() as IntId;
            expect(intId1.equals(intId2)).toBeTruthy();
            expect(intId1.compareTo(intId2)).toBe(0);
        });
        it('Should release an IntId.', () => {
            const intId1: IntId = new IntId(0);
            expect(intId1.toString()).toBe('0');
            intId1.finalize();
            expect(intId1.toString()).toBe('-1');
        });
    });
});