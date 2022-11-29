/*
 * MIT License
 *
 * Copyright (c) 2022 @ornorm
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

import {Version, VersionOptions} from '../src/version';

describe('Describe the Version API.', () => {
  describe('Describe constructor.', () => {
    const expectNegativeVersion: (options: VersionOptions, msg: string) => void =
      (options: VersionOptions, msg: string): void => {
        try {
          new Version(options);
        } catch (e: unknown) {
          expect((e as Error).message).toMatch(msg);
        }
      };
    const expectValidVersion: (options: VersionOptions, msg: string) => void =
      (options: VersionOptions, version: string): void =>
        expect(new Version(options).version).toBe(version);
    const expectInvalidVersion: (options: VersionOptions) => void =
      (options: VersionOptions): void => {
        try {
          new Version(options);
        } catch (e: unknown) {
          expect((e as Error).message).toBe(`IllegalArgumentException invalid <${options.version}> version.`);
        }
      };
    const INVALID_VERSIONS: Array<string> = [
      'Invalid Semantic Versions', '1', '1.2', '1.2.3-0123', '1.2.3-0123.0123', '1.1.2+.123', '+invalid', '-invalid',
      '-invalid+invalid', '-invalid.01', 'alpha', 'alpha.beta', 'alpha.beta.1', 'alpha.1', 'alpha+beta', 'alpha_beta',
      'alpha.', 'alpha..', 'beta', '1.0.0-alpha_beta', '-alpha.', '1.0.0-alpha..', '1.0.0-alpha..1', '1.0.0-alpha...1',
      '1.0.0-alpha....1', '1.0.0-alpha.....1', '1.0.0-alpha......1', '1.0.0-alpha.......1', '01.1.1', '1.01.1',
      '1.1.01', '1.2', '1.2.3.DEV', '1.2-SNAPSHOT', '1.2.31.2.3----RC-', 'SNAPSHOT.12.09.1--..12+788', '1.2-RC-SNAPSHOT',
      '-1.0.3-gamma+b7718', '+justmeta', '9.8.7+meta+meta', '9.8.7-whatever+meta+meta',
      '99999999999999999999999.999999999999999999.99999999999999999----RC-SNAPSHOT.12.09.1--------------------------------..12'
    ];

    it('Should reject invalid version numbers.', () => {
      expectNegativeVersion({
        major: -1, minor: 0, patch: 0
      }, `IllegalArgumentException major version must be positive`);
      expectNegativeVersion({
        major: NaN, minor: 0, patch: 0
      }, `IllegalArgumentException major version must be a number`);
      expectNegativeVersion({
        major: 1000 / 0, minor: 0, patch: 0
      }, `IllegalArgumentException major version must be finite`);

      expectNegativeVersion({
        major: 0, minor: -1, patch: 0
      }, `IllegalArgumentException minor version must be positive`);
      expectNegativeVersion({
        major: 0, minor: NaN, patch: 0
      }, `IllegalArgumentException minor version must be a number`);
      expectNegativeVersion({
        major: 0, minor: 1000 / 0, patch: 0
      }, `IllegalArgumentException minor version must be finite`);

      expectNegativeVersion({
        major: 0, minor: 0, patch: -1
      }, `IllegalArgumentException patch version must be positive`);
      expectNegativeVersion({
        major: 0, minor: 0, patch: NaN
      }, `IllegalArgumentException patch version must be a number`);
      expectNegativeVersion({
        major: 0, minor: 0, patch: 1000 / 0
      }, `IllegalArgumentException patch version must be finite`);
    });
    it('Should validate parsed version.', () => {
      expectValidVersion({major: 0, minor: 0, patch: 4}, `0.0.4`);
      expectValidVersion({version: `0.0.4`}, `0.0.4`);

      expectValidVersion({major: 1, minor: 2, patch: 3}, `1.2.3`);
      expectValidVersion({version: `1.2.3`}, `1.2.3`);

      expectValidVersion({major: 10, minor: 20, patch: 30}, `10.20.30`);
      expectValidVersion({version: `10.20.30`}, `10.20.30`);

      expectValidVersion({
        major: 1, minor: 1, patch: 2, preRelease: 'prerelease', buildMetadata: 'meta'
      }, `1.1.2-prerelease+meta`);
      expectValidVersion({version: `1.1.2-prerelease+meta`}, `1.1.2-prerelease+meta`);

      expectValidVersion({major: 1, minor: 1, patch: 2, buildMetadata: 'meta'}, `1.1.2+meta`);
      expectValidVersion({version: `1.1.2+meta`}, `1.1.2+meta`);

      expectValidVersion({major: 1, minor: 1, patch: 2, buildMetadata: 'meta-valid'}, `1.1.2+meta-valid`);
      expectValidVersion({version: `1.1.2+meta-valid`}, `1.1.2+meta-valid`);

      expectValidVersion({major: 1, minor: 0, patch: 0, preRelease: 'alpha'}, `1.0.0-alpha`);
      expectValidVersion({version: `1.0.0-alpha`}, `1.0.0-alpha`);

      expectValidVersion({major: 1, minor: 0, patch: 0, preRelease: 'beta'}, `1.0.0-beta`);
      expectValidVersion({version: `1.0.0-beta`}, `1.0.0-beta`);

      expectValidVersion({major: 1, minor: 0, patch: 0, preRelease: 'alpha.beta'}, `1.0.0-alpha.beta`);
      expectValidVersion({version: `1.0.0-alpha.beta`}, `1.0.0-alpha.beta`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0, preRelease: 'alpha.beta.1'
      }, `1.0.0-alpha.beta.1`);
      expectValidVersion({version: `1.0.0-alpha.beta.1`}, `1.0.0-alpha.beta.1`);

      expectValidVersion({major: 1, minor: 0, patch: 0, preRelease: 'alpha.1'}, `1.0.0-alpha.1`);
      expectValidVersion({version: `1.0.0-alpha.1`}, `1.0.0-alpha.1`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0, preRelease: 'alpha0.valid'
      }, `1.0.0-alpha0.valid`);
      expectValidVersion({version: `1.0.0-alpha0.valid`}, `1.0.0-alpha0.valid`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0, preRelease: 'alpha.0valid'
      }, `1.0.0-alpha.0valid`);
      expectValidVersion({version: `1.0.0-alpha.0valid`}, `1.0.0-alpha.0valid`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0,
        preRelease: 'alpha.a.b-c-somethinglong',
        buildMetadata: 'build.1-aef.1-its-okay'
      }, `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`);
      expectValidVersion({
        version: `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`
      }, `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0, preRelease: 'rc.1', buildMetadata: 'build.1'
      }, `1.0.0-rc.1+build.1`);
      expectValidVersion({version: `1.0.0-rc.1+build.1`}, `1.0.0-rc.1+build.1`);

      expectValidVersion({
        major: 2, minor: 0, patch: 0, preRelease: 'rc.1', buildMetadata: 'build.123'
      }, `2.0.0-rc.1+build.123`);
      expectValidVersion({version: `2.0.0-rc.1+build.123`}, `2.0.0-rc.1+build.123`);

      expectValidVersion({major: 1, minor: 2, patch: 3, preRelease: 'beta'}, `1.2.3-beta`);
      expectValidVersion({version: `1.2.3-beta`}, `1.2.3-beta`);

      expectValidVersion({
        major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'
      }, `10.2.3-DEV-SNAPSHOT`);
      expectValidVersion({version: `10.2.3-DEV-SNAPSHOT`}, `10.2.3-DEV-SNAPSHOT`);

      expectValidVersion({
        major: 1, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT-123'
      }, `1.2.3-DEV-SNAPSHOT-123`);
      expectValidVersion({version: `1.2.3-DEV-SNAPSHOT-123`}, `1.2.3-DEV-SNAPSHOT-123`);

      expectValidVersion({
        major: 2, minor: 0, patch: 0, buildMetadata: 'build.1848'
      }, `2.0.0+build.1848`);
      expectValidVersion({version: `2.0.0+build.1848`}, `2.0.0+build.1848`);

      expectValidVersion({
        major: 2, minor: 0, patch: 1, buildMetadata: 'build.1848'
      }, `2.0.1+build.1848`);
      expectValidVersion({version: `2.0.1+build.1848`}, `2.0.1+build.1848`);

      expectValidVersion({
        major: 1, minor: 0, patch: 0, preRelease: 'alpha', buildMetadata: 'beta'
      }, `1.0.0-alpha+beta`);
      expectValidVersion({version: `1.0.0-alpha+beta`}, `1.0.0-alpha+beta`);

      expectValidVersion({
        major: 1, minor: 2, patch: 3, preRelease: '---R-S.12.9.1--.12', buildMetadata: '788'
      }, `1.2.3----R-S.12.9.1--.12+788`);
      expectValidVersion({version: `1.2.3----R-S.12.9.1--.12+788`}, `1.2.3----R-S.12.9.1--.12+788`);

      expectValidVersion({
        major: 1, minor: 2, patch: 3, preRelease: '---R-S.12.9.1--.12', buildMetadata: 'meta'
      }, `1.2.3----R-S.12.9.1--.12+meta`);
      expectValidVersion({version: `1.2.3----R-S.12.9.1--.12+meta`}, `1.2.3----R-S.12.9.1--.12+meta`);

      expectValidVersion({
        major: 1, minor: 2, patch: 3, preRelease: '---RC-SNAPSHOT.12.9.1--.12'
      }, `1.2.3----RC-SNAPSHOT.12.9.1--.12`);
      expectValidVersion({
        version: `1.2.3----RC-SNAPSHOT.12.9.1--.12`
      }, `1.2.3----RC-SNAPSHOT.12.9.1--.12`);

      expectValidVersion({
        major: 1,
        minor: 0,
        patch: 0,
        buildMetadata: '0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999'
      }, `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`);
      expectValidVersion({
        version: `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`
      }, `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`);

      expectValidVersion({major: 1, minor: 0, patch: 0, preRelease: '0A.is.legal'}, `1.0.0-0A.is.legal`);
      expectValidVersion({version: `1.0.0-0A.is.legal`}, `1.0.0-0A.is.legal`);
    });
    it('Should reject invalid parsed version.', () =>
      INVALID_VERSIONS.forEach((version: string) =>
        expectInvalidVersion({version})
      ));
  });
});
