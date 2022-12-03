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

import Semver from '../src/semver';
import {Version, VersionOptions} from '../src/version';

describe('Describe version.js', () => {
    describe('On version creation', () => {
        describe('Should reject invalid version components numbers - https://semver.org/#spec-item-2', () => {
            const MUST_BE_POSITIVE: string = 'IllegalArgumentException key version must be positive';
            const MUST_BE_NUMBER: string = 'IllegalArgumentException key version must be a number';
            const MUST_BE_FINITE: string = 'IllegalArgumentException key version must be finite';
            const expectInvalidVersion: (options: VersionOptions, msg: string) => void =
                (options: VersionOptions, msg: string): void => {
                    try {
                        new Version(options);
                    } catch (e: unknown) {
                        expect((e as Error).message).toMatch(msg);
                    }
                };
            const runExpectInvalidVersion: (dataSet: Array<[VersionOptions, string, string]>) => void =
                (dataSet: Array<[VersionOptions, string, string]>): void => {
                    dataSet.forEach(([options, key, expected]) => {
                        const expectation: string = expected.replace('key', key);
                        it(`{"${key}": ${Reflect.get(options, key)}} throw ${expectation}`, () =>
                            expectInvalidVersion(options, expectation))
                    });
                };

            runExpectInvalidVersion([
                [{major: -1, minor: 0, patch: 0}, 'major', MUST_BE_POSITIVE],
                [{major: NaN, minor: 0, patch: 0}, 'major', MUST_BE_NUMBER],
                [{major: 1000 / 0, minor: 0, patch: 0}, 'major', MUST_BE_FINITE],
                [{major: 0, minor: -1, patch: 0}, 'minor', MUST_BE_POSITIVE],
                [{major: 0, minor: NaN, patch: 0}, 'minor', MUST_BE_NUMBER],
                [{major: 0, minor: 1000 / 0, patch: 0}, 'minor', MUST_BE_FINITE],
                [{major: 0, minor: 0, patch: -1}, 'patch', MUST_BE_POSITIVE],
                [{major: 0, minor: 0, patch: NaN}, 'patch', MUST_BE_NUMBER],
                [{major: 0, minor: 0, patch: 1000 / 0}, 'patch', MUST_BE_FINITE]
            ]);
        });
        describe('Should resolve valid parsed string version - https://semver.org/#spec-item-2', () => {
            const expectValidVersion: (options: VersionOptions, msg: string) => void =
                (options: VersionOptions, version: string): void =>
                    expect(new Version(options).version).toBe(version);
            const runExpectValidateVersion: (dataSet: Array<[VersionOptions, string]>) => void =
                (dataSet: Array<[VersionOptions, string]>): void => {
                    dataSet.forEach(([options, expected]) => {
                        it(`${JSON.stringify(options)} parsed to <${expected}>`, () =>
                            expectValidVersion(options, expected))
                    });
                };

            runExpectValidateVersion([
                [{major: 0, minor: 0, patch: 4}, `0.0.4`],
                [{version: `0.0.4`}, `0.0.4`],
                [{major: 1, minor: 2, patch: 3}, `1.2.3`],
                [{version: `1.2.3`}, `1.2.3`],
                [{major: 10, minor: 20, patch: 30}, `10.20.30`],
                [{version: `10.20.30`}, `10.20.30`],
                [{version: `v10.20.30`}, `10.20.30`],
                [{
                    major: 1,
                    minor: 1,
                    patch: 2,
                    preRelease: 'prerelease',
                    buildMetadata: 'meta'
                }, `1.1.2-prerelease+meta`],
                [{version: `1.1.2-prerelease+meta`}, `1.1.2-prerelease+meta`],
                [{major: 1, minor: 1, patch: 2, buildMetadata: 'meta'}, `1.1.2+meta`],
                [{version: `1.1.2+meta`}, `1.1.2+meta`],
                [{major: 1, minor: 1, patch: 2, buildMetadata: 'meta-valid'}, `1.1.2+meta-valid`],
                [{version: `1.1.2+meta-valid`}, `1.1.2+meta-valid`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha'}, `1.0.0-alpha`],
                [{version: `1.0.0-alpha`}, `1.0.0-alpha`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'beta'}, `1.0.0-beta`],
                [{version: `1.0.0-beta`}, `1.0.0-beta`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha.beta.1'}, `1.0.0-alpha.beta.1`],
                [{version: `1.0.0-alpha.beta.1`}, `1.0.0-alpha.beta.1`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha.1'}, `1.0.0-alpha.1`],
                [{version: `1.0.0-alpha.1`}, `1.0.0-alpha.1`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha0.valid'}, `1.0.0-alpha0.valid`],
                [{version: `1.0.0-alpha0.valid`}, `1.0.0-alpha0.valid`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha.0valid'}, `1.0.0-alpha.0valid`],
                [{version: `1.0.0-alpha.0valid`}, `1.0.0-alpha.0valid`],
                [{
                    major: 1, minor: 0, patch: 0,
                    preRelease: 'alpha.a.b-c-somethinglong',
                    buildMetadata: 'build.1-aef.1-its-okay'
                }, `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`],
                [{version: `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`},
                    `1.0.0-alpha.a.b-c-somethinglong+build.1-aef.1-its-okay`],
                [{
                    major: 1, minor: 0, patch: 0, preRelease: 'rc.1', buildMetadata: 'build.1'
                }, `1.0.0-rc.1+build.1`],
                [{version: `1.0.0-rc.1+build.1`}, `1.0.0-rc.1+build.1`],
                [{
                    major: 2, minor: 0, patch: 0, preRelease: 'rc.1', buildMetadata: 'build.123'
                }, `2.0.0-rc.1+build.123`],
                [{version: `2.0.0-rc.1+build.123`}, `2.0.0-rc.1+build.123`],
                [{major: 1, minor: 2, patch: 3, preRelease: 'beta'}, `1.2.3-beta`],
                [{version: `1.2.3-beta`}, `1.2.3-beta`],
                [{major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, `10.2.3-DEV-SNAPSHOT`],
                [{version: `10.2.3-DEV-SNAPSHOT`}, `10.2.3-DEV-SNAPSHOT`],
                [{major: 1, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT-123'}, `1.2.3-DEV-SNAPSHOT-123`],
                [{version: `1.2.3-DEV-SNAPSHOT-123`}, `1.2.3-DEV-SNAPSHOT-123`],
                [{major: 2, minor: 0, patch: 0, buildMetadata: 'build.1848'}, `2.0.0+build.1848`],
                [{version: `2.0.0+build.1848`}, `2.0.0+build.1848`],
                [{major: 2, minor: 0, patch: 1, buildMetadata: 'build.1848'}, `2.0.1+build.1848`],
                [{version: `2.0.1+build.1848`}, `2.0.1+build.1848`],
                [{major: 1, minor: 0, patch: 0, preRelease: 'alpha', buildMetadata: 'beta'}, `1.0.0-alpha+beta`],
                [{version: `1.0.0-alpha+beta`}, `1.0.0-alpha+beta`],
                [{major: 1, minor: 2, patch: 3, preRelease: '---R-S.12.9.1--.12', buildMetadata: '788'},
                    `1.2.3----R-S.12.9.1--.12+788`],
                [{version: `1.2.3----R-S.12.9.1--.12+788`}, `1.2.3----R-S.12.9.1--.12+788`],
                [{major: 1, minor: 2, patch: 3, preRelease: '---R-S.12.9.1--.12', buildMetadata: 'meta'},
                    `1.2.3----R-S.12.9.1--.12+meta`],
                [{version: `1.2.3----R-S.12.9.1--.12+meta`}, `1.2.3----R-S.12.9.1--.12+meta`],
                [{major: 1, minor: 2, patch: 3, preRelease: '---RC-SNAPSHOT.12.9.1--.12'},
                    `1.2.3----RC-SNAPSHOT.12.9.1--.12`],
                [{version: `1.2.3----RC-SNAPSHOT.12.9.1--.12`}, `1.2.3----RC-SNAPSHOT.12.9.1--.12`],
                [{
                    major: 1, minor: 0, patch: 0,
                    buildMetadata: '0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999'
                }, `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`],
                [{
                    version: `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`
                }, `1.0.0+0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999`],
                [{major: 1, minor: 0, patch: 0, preRelease: '0A.is.legal'}, `1.0.0-0A.is.legal`],
                [{version: `1.0.0-0A.is.legal`}, `1.0.0-0A.is.legal`]
            ]);
        });
        describe('Should reject invalid parsed string version - https://semver.org/#spec-item-2', () => {
            const INVALID_VERSION_STRING: string = 'IllegalArgumentException invalid <value> version.';
            const INVALID_VERSIONS: Array<[VersionOptions]> = [
                'Invalid Semantic Versions', '1', '1.2', '1.2.3-0123', '1.2.3-0123.0123', '1.1.2+.123', '+invalid', '-invalid',
                '-invalid+invalid', '-invalid.01', 'alpha', 'alpha.beta', 'alpha.beta.1', 'alpha.1', 'alpha+beta', 'alpha_beta',
                'alpha.', 'alpha..', 'beta', '1.0.0-alpha_beta', '-alpha.', '1.0.0-alpha..', '1.0.0-alpha..1', '1.0.0-alpha...1',
                '1.0.0-alpha....1', '1.0.0-alpha.....1', '1.0.0-alpha......1', '1.0.0-alpha.......1', '01.1.1', '1.01.1',
                '1.1.01', '1.2', '1.2.3.DEV', '1.2-SNAPSHOT', '1.2.31.2.3----RC-', 'SNAPSHOT.12.09.1--..12+788', '1.2-RC-SNAPSHOT',
                '-1.0.3-gamma+b7718', '+justmeta', '9.8.7+meta+meta', '9.8.7-whatever+meta+meta',
                '99999999999999999999999.999999999999999999.99999999999999999----RC-SNAPSHOT.12.09.1--------------------------------..12'
            ].map((version: string) => [{version}]);
            const expectInvalidVersion: (options: VersionOptions, expected: string) => void =
                (options: VersionOptions, expected: string): void => {
                    try {
                        new Version(options);
                    } catch (e: unknown) {
                        expect((e as Error).message).toBe(expected);
                    }
                };
            const runExpectInvalidVersion: (dataSet: Array<[VersionOptions]>) => void =
                (dataSet: Array<[VersionOptions]>): void => {
                    dataSet.forEach(([options]) => {
                        const expectation: string = INVALID_VERSION_STRING
                            .replace('value', `${options.version}`);
                        it(`${JSON.stringify(options)} throw ${expectation}`,
                            () => expectInvalidVersion(options, expectation))
                    });
                };

            runExpectInvalidVersion(INVALID_VERSIONS);
        });
    });
    describe('Version instance', () => {
        describe('Can check if pre-release version - https://semver.org/#spec-item-9', () => {
            const expectSnapshotVersion: (options: VersionOptions, expected: boolean) => void =
                (options: VersionOptions, expected: boolean): void =>
                    expect(new Version(options).isSnapshot).toBe(expected);
            const runExpectSnapshotVersion: (dataSet: Array<[VersionOptions, boolean]>) => void =
                (dataSet: Array<[VersionOptions, boolean]>): void => {
                    dataSet.forEach(([options, expected]) => {
                        it(`${JSON.stringify(options)} to be snapshot version ${expected}`, () =>
                            expectSnapshotVersion(options, expected))
                    });
                };

            runExpectSnapshotVersion([
                [{major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, true],
                [{
                    major: 1, minor: 0, patch: 0,
                    buildMetadata: '0.build.1-rc.10000aaa-kk-0.199999999999999999999999.999999999999999999.99999999999999999'
                }, false]
            ]);
        });
        describe('Can check if initial development version - https://semver.org/#spec-item-4', () => {
            const expectDevelopmentVersion: (options: VersionOptions, expected: boolean) => void =
                (options: VersionOptions, expected: boolean): void =>
                    expect(new Version(options).isInDevelopment).toBe(expected);
            const runExpectDevelopmentVersion: (dataSet: Array<[VersionOptions, boolean]>) => void =
                (dataSet: Array<[VersionOptions, boolean]>): void => {
                    dataSet.forEach(([options, expected]) => {
                        it(`${JSON.stringify(options)} to be development version ${expected}`, () =>
                            expectDevelopmentVersion(options, expected))
                    });
                };

            runExpectDevelopmentVersion([
                [{major: 0, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, true],
                [{major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, false]
            ]);

            const expectStableVersion: (options: VersionOptions, expected: boolean) => void =
                (options: VersionOptions, expected: boolean): void =>
                    expect(new Version(options).isStable).toBe(expected);
            const runExpectStableVersion: (dataSet: Array<[VersionOptions, boolean]>) => void =
                (dataSet: Array<[VersionOptions, boolean]>): void => {
                    dataSet.forEach(([options, expected]) => {
                        it(`${JSON.stringify(options)} to be stable version ${expected}`, () =>
                            expectStableVersion(options, expected))
                    });
                };

            runExpectStableVersion([
                [{major: 0, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, false],
                [{major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, true]
            ]);
        });
        describe('Can check if public API version - https://semver.org/#spec-item-5', () => {
            const expectIsPublicApiVersion: (version: Semver, expected: boolean) => void =
                (version: Semver, expected: boolean): void =>
                    expect(version.isPublicApi).toBe(expected);
            const runExpectIsPublicApiVersion: (dataSet: Array<[Semver, boolean]>) => void =
                (dataSet: Array<[Semver, boolean]>): void => {
                    dataSet.forEach(([version, expected]) => {
                        it(`${version.toString()} to be public api version ${expected}`, () =>
                            expectIsPublicApiVersion(version, expected))
                    });
                };

            runExpectIsPublicApiVersion([
                [Version.firstRelease, true],
                [new Version({major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}), false],
                [new Version({major: 1, buildMetadata: 'meta'}), true],
                [new Version({version: '1.0.1'}), false],
            ]);
        });
        describe('Can check if bug fix version - https://semver.org/#spec-item-6', () => {
            const expectIsBugFixVersion: (version: Semver, expected: boolean) => void =
                (version: Semver, expected: boolean): void =>
                    expect(version.isBugFix).toBe(expected);
            const runExpectIsBugFixVersion: (dataSet: Array<[Semver, boolean]>) => void =
                (dataSet: Array<[Semver, boolean]>): void => {
                    dataSet.forEach(([version, expected]) => {
                        it(`${version.toString()} to be a bug fix version ${expected}`, () =>
                            expectIsBugFixVersion(version, expected))
                    });
                };

            runExpectIsBugFixVersion([
                [Version.firstRelease, false],
                [Version.firstRelease.bugFixes, true],
                [new Version({major: 1, minor: 0, patch: 3, preRelease: 'DEV-SNAPSHOT'}), true],
                [new Version({major: 4, patch: 0, buildMetadata: 'meta'}), false]
            ]);
        });
        describe('Can check if break changes version - https://semver.org/#what-if-i-inadvertently-alter-the-public-api-in-a-way-that-is-not-compliant-with-the-version-number-change-ie-the-code-incorrectly-introduces-a-major-breaking-change-in-a-patch-release', () => {
            const expectIsBreakChangesVersion: (version: Semver, major: number, minor: number, patch: number) => void =
                (version: Semver, major: number, minor: number, patch: number): void => {
                    const newFeatures: Semver = version.breakChanges;
                    expect(newFeatures.major).toBe(major);
                    expect(newFeatures.minor).toBe(minor);
                    expect(newFeatures.patch).toBe(patch);
                };
            const runExpectIsBreakChangesVersion: (dataSet: Array<[Semver, number, number, number]>) => void =
                (dataSet: Array<[Semver, number, number, number]>): void => {
                    dataSet.forEach(([version, major, minor, patch]) => {
                        it(`Expect {major: ${version.major}, minor: ${version.minor}, patch: ${version.patch}} to be {major: ${major}, minor: ${minor}, patch: ${patch}} after break changes`, () =>
                            expectIsBreakChangesVersion(version, major, minor, patch))
                    });
                };

            runExpectIsBreakChangesVersion([
                [Version.firstRelease, 2, 0, 0],
                [Version.firstRelease.bugFixes.newFeatures, 2, 0, 0],
                [new Version({major: 3, patch: 3, preRelease: 'DEV-SNAPSHOT'}), 4, 0, 0],
                [new Version({major: 10, minor: 2, buildMetadata: 'meta'}), 11, 0, 0]
            ]);
        });
        describe('Can be cloned', () => {
            const expectCloneVersion: (options: VersionOptions, version: string) => void =
                (options: VersionOptions, version: string): void =>
                    expect(new Version(options).clone().version).toBe(version);
            const runExpectCloneVersion: (dataSet: Array<[VersionOptions, string]>) => void =
                (dataSet: Array<[VersionOptions, string]>): void => {
                    dataSet.forEach(([options, version]) =>
                        it(`Expect ${JSON.stringify(options)} to be {version: ${version}} after clone`,
                            () => expectCloneVersion(options, version))
                    );
                };

            runExpectCloneVersion([
                [{major: 0, minor: 0, patch: 4}, `0.0.4`],
                [{version: `0.0.4`}, `0.0.4`],
                [{major: 1, minor: 2, patch: 3}, `1.2.3`],
                [{version: `1.2.3`}, `1.2.3`],
                [{major: 10, minor: 20, patch: 30}, `10.20.30`],
                [{version: `10.20.30`}, `10.20.30`],
                [{version: `v10.20.30`}, `10.20.30`],
                [{
                    major: 1,
                    minor: 1,
                    patch: 2,
                    preRelease: 'prerelease',
                    buildMetadata: 'meta'
                }, `1.1.2-prerelease+meta`],
                [{version: `1.1.2-prerelease+meta`}, `1.1.2-prerelease+meta`],
                [{major: 1, minor: 1, patch: 2, buildMetadata: 'meta'}, `1.1.2+meta`],
                [{version: `1.1.2+meta`}, `1.1.2+meta`]
            ]);
        });
        describe('Can check if equals to', () => {
            const expectEqualsVersion: (options: VersionOptions, obj: any, expected: boolean) => void =
                (options: VersionOptions, obj: any, expected: boolean): void =>
                    expect(new Version(options).equals(obj)).toBe(expected);
            const runExpectEqualsVersion: (dataSet: Array<[VersionOptions, any, boolean]>) => void =
                (dataSet: Array<[VersionOptions, any, boolean]>): void => {
                    dataSet.forEach(([options, obj, expected]) =>
                        it(`Expect ${JSON.stringify(options)} to equals ${JSON.stringify(obj)} to be ${expected}`,
                            () => expectEqualsVersion(options, obj, expected))
                    );
                };

            runExpectEqualsVersion([
                [{major: 10, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT'}, `10.2.3-DEV-SNAPSHOT`, false],
                [{version: `10.2.3-DEV-SNAPSHOT`}, new Version({version: `10.2.3-DEV-SNAPSHOT`}), true],
                [{major: 1, minor: 2, patch: 3, preRelease: 'DEV-SNAPSHOT-123'}, [], false],
                [{version: `1.2.3-DEV-SNAPSHOT-123`}, new Version({version: `1.2.3-DEV-SNAPSHOT-123`}), true],
                [{major: 2, minor: 0, patch: 0, buildMetadata: 'build.1848'}, {}, false],
                [{version: `2.0.0+build.1848`}, new Version({version: `2.0.0+build.1848`}), true],
                [{major: 2, minor: 0, patch: 1, buildMetadata: 'build.1848'}, 10, false]
            ]);
        });
    });
    describe('Describe Version compare to.', () => {
        const cmp: { [key: string]: string } = {'1': '>', '0': '=', '-1': '<'};
        const buildVersion: (version: string) => Version = (version: string): Version => (
            new Version({version})
        );
        const runTests: (dataSet: Array<[string, string, number]>) => void =
            (dataSet: Array<[string, string, number]>): void => {
                dataSet.forEach(([v1, v2, expected]) => {
                    it(`${v1} ${cmp[expected]} ${v2}`, () =>
                        expect(buildVersion(v1).compareTo(buildVersion(v2))).toBe(expected))
                });
            };

        describe('single-segment versions', () => {
            runTests([
                ['10', '9', 1],
                ['10', '10', 0],
                ['9', '10', -1],
            ]);
        });
        describe('two-segment versions', () => {
            runTests([
                ['10.8', '10.4', 1],
                ['10.1', '10.1', 0],
                ['10.1', '10.2', -1],
            ]);
        });
        describe('three-segment versions', () => {
            runTests([
                ['10.1.8', '10.0.4', 1],
                ['10.0.1', '10.0.1', 0],
                ['10.1.1', '10.2.2', -1],
                ['11.0.10', '11.0.2', 1],
                ['11.0.2', '11.0.10', -1],
            ]);
        });
        describe('different segment versions', () => {
            runTests([
                ['11.1.10', '11.0', 1],
                ['1.1.1', '1', 1],
                ['01.1.0', '1.01', 0],
                ['1.0.0', '1', 0],
                ['10.0.0', '10.114', -1],
                ['1.0', '1.4.1', -1],
            ]);
        });
        describe('pre-release versions - https://semver.org/#spec-item-9', () => {
            runTests([
                ['1.0.0-alpha.1', '1.0.0-alpha', 1],
                ['1.0.0-alpha', '1.0.0-alpha.1', -1],
                ['1.0.0-alpha.1', '1.0.0-alpha.beta', -1],
                ['1.0.0-alpha.beta', '1.0.0-beta', -1],
                ['1.0.0-beta', '1.0.0-beta.2', -1],
                ['1.0.0-beta.2', '1.0.0-beta.11', -1],
                ['1.0.0-beta.11', '1.0.0-rc.1', -1],
                ['1.0.0-rc.1', '1.0.0', -1],
                ['1.0.0-alpha', '1', -1],
                ['1.0.0-beta.11', '1.0.0-beta.1', 1],
                ['1.0.0-beta.10', '1.0.0-beta.9', 1],
                ['1.0.0-beta.10', '1.0.0-beta.90', -1],
            ]);
        });
        describe('ignore build metadata - https://semver.org/#spec-item-10', () => {
            runTests([
                ['1.4.0-build.3928', '1.4.0-build.3928+sha.a8d9d4f', 0],
                ['1.4.0-build.3928+sha.b8dbdb0', '1.4.0-build.3928+sha.a8d9d4f', 0],
                ['1.0.0-alpha+001', '1.0.0-alpha', 0],
                ['1.0.0-beta+exp.sha.5114f85', '1.0.0-beta+exp.sha.999999', 0],
                ['1.0.0+20130313144700', '1.0.0', 0],
                ['1.0.0+20130313144700', '2.0.0', -1],
                ['1.0.0+20130313144700', '1.0.1+11234343435', -1],
                ['1.0.1+1', '1.0.1+2', 0],
                ['1.0.0+a-a', '1.0.0+a-b', 0],
            ]);
        });
        describe('ignore leading `v`', () => {
            runTests([
                ['v1.0.0', '1.0.0', 0],
                ['v1.0.0', 'v1.0.0', 0],
                ['v1.0.0', 'v1.0.0', 0],
                ['v1.0.0-alpha', '1.0.0-alpha', 0],
            ]);
        });
        describe('ignore leading `0`', () => {
            runTests([
                ['01.0.0', '1', 0],
                ['01.0.0', '1.0.0', 0],
                ['1.01.0', '1.01.0', 0],
                ['1.0.03', '1.0.3', 0],
                ['1.0.03-alpha', '1.0.3-alpha', 0],
                ['v01.0.0', '1.0.0', 0],
                ['v01.0.0', '2.0.0', -1],
            ]);
        });
    });
});
