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

/**
 * Represent a special identifier.
 */
export interface SpecialId {
    /**
     * True when snapshot.
     */
    isSnapshot: boolean;
    /**
     * Clone this {@link SpecialId}.
     *
     * @return A clone
     */
    clone(): SpecialId;
    /**
     * Compare to the specified {@link SpecialId}.
     *
     * @param other To be compared to.
     * @return The result.
     */
    compareTo(other: SpecialId): number;
    /**
     * Check if the specified value is the same {@link SpecialId}.
     *
     * @return True when the same
     */
    equals(obj: any): boolean;
    /**
     * Release this {@link SpecialId}.
     */
    finalize(): void;
    /**
     * Return a string representation of this {@link SpecialId}.
     *
     * @return A string that represent this instance
     */
    toString(): string;
}

/**
 * MAJOR version when you make incompatible API changes.
 */
export const VERSION_TYPE_MAJOR: number = 0;

/**
 * MINOR version when you add functionality in a backwards compatible manner.
 */
export const VERSION_TYPE_MINOR: number = 1;

/**
 * PATCH version when you make backwards compatible bug fixes.
 */
export const VERSION_TYPE_PATCH: number = 2;

/**
 * Additional labels for pre-release and build metadata are available
 * as extensions to the MAJOR.MINOR.PATCH format.
 */
export const VERSION_TYPE_SPECIAL: number = 3;

/**
 * {@link Semver} component. From most meaningful to less meaningful.
 */
export type VersionType = 0 | 1 | 2 | 3;

/**
 * Given a version number MAJOR.MINOR.PATCH, increment the:
 * <ol>
 *   <li> MAJOR version when you make incompatible API changes,
 *   <li> MINOR version when you add functionality in a backwards compatible manner, and
 *   <li> PATCH version when you make backwards compatible bug fixes.
 * </ol>
 * Additional labels for pre-release and build metadata are available as extensions to the
 * MAJOR.MINOR.PATCH format.
 */
export interface Semver {
    /**
     * Return changes that break backward compatibility {@link Semver}, stage major
     * release that increment the major value and reset the minor and patch value.
     */
    breakChanges: Semver;
    /**
     * Return a backward compatible bug fixes {@link Semver}, stage patch release that Increment
     * the patch value.
     */
    bugFixes: Semver
    /**
     * Build metadata MAY be denoted by appending a plus sign and a series
     * of dot separated identifiers immediately following the patch or pre-release version.
     * <p>
     * Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-].
     * <p>
     * Identifiers MUST NOT be empty. Build metadata MUST be ignored when determining
     * version precedence. Thus two versions that differ only in the build metadata,
     * have the same precedence.
     *
     * @example 1.0.0-alpha+001, 1.0.0+20130313144700, 1.0.0-beta+exp.sha.5114f85, 1.0.0+21AF26D3—-117B344092BD.
     */
    buildMetadata?: string;
    /**
     * True when patch version is greater than 0.
     */
    isBugFix: boolean;
    /**
     * True when development version.
     */
    isInDevelopment: boolean;
    /**
     * True when version 1.0.0 that defines the public API.
     */
    isPublicApi: boolean;
    /**
     * True when SNAPSHOT version.
     */
    isSnapshot: boolean;
    /**
     * True when stable version.
     */
    isStable: boolean;
    /**
     * Major version zero (0.y.z) is for initial development.
     * <p>
     * Anything MAY change at any time. The public API SHOULD NOT be considered stable.
     * <p>
     * Major version X (X.y.z | X > 0) MUST be incremented if any backwards incompatible
     * changes are introduced to the public API.
     * <p>
     * It MAY also include minor and patch level changes. Patch and minor versions MUST
     * be reset to 0 when major version is incremented.
     */
    major: number;
    /**
     * Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backwards
     * compatible functionality is introduced to the public API.
     * <p>
     *   It MUST be incremented if any public API functionality is marked as deprecated.
     * <p>
     *   It MAY be incremented if substantial new functionality or improvements are
     *   introduced within the private code. It MAY include patch level changes.
     * <p>
     *   Patch version MUST be reset to 0 when minor version is incremented.
     */
    minor: number;
    /**
     * Return a backward compatible new features {@link Semver}, stage minor release that Increment
     * the minor value and reset the patch value.
     */
    newFeatures: Semver;
    /**
     * Patch version Z (x.y.Z | x > 0) MUST be incremented if only backwards compatible
     * bug fixes are introduced.
     * <p>
     * A bug fix is defined as an internal change that fixes incorrect behavior.
     */
    patch: number;
    /**
     * A pre-release version taht MAY be denoted by appending a hyphen and a series
     * of dot separated identifiers immediately following the patch version.
     * <p>
     *   Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-].
     *   Identifiers MUST NOT be empty. Numeric identifiers MUST NOT include leading zeroes.
     * <p>
     *   Pre-release versions have a lower precedence than the associated normal version.
     *   A pre-release version indicates that the version is unstable and might not satisfy
     *   the intended compatibility requirements as denoted by its associated normal version.
     *
     * @example 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-0.3.7, 1.0.0-x.7.z.92, 1.0.0-x-y-z.–.
     */
    preRelease?: string;
    /**
     * A normal version number MUST take the form X.Y.Z where X, Y, and Z are
     * non-negative integers, and MUST NOT contain leading zeroes. X is the major
     * version, Y is the minor version, and Z is the patch version.
     * <p>
     *   Each element MUST increase numerically. For instance: 1.9.0 -> 1.10.0 -> 1.11.0.
     * <p>
     *   Once a versioned package has been released, the contents of that version MUST NOT be modified.
     *   Any modifications MUST be released as a new version.
     */
    version: string;

    /**
     * Clone this {@link Version}.
     *
     * @return A {@link Semver} implementation
     */
    clone(): Semver;

    /**
     * Compare to another {@link Semver}.
     *
     * @return A number
     */
    compareTo(another: Semver): number;

    /**
     * Check if this {@link Semver} equals the specified one.
     *
     * @param another To compare to.
     * @return True when equals
     */
    eq(another: Semver): boolean;

    /**
     * Check if the specified value is the same {@link Semver}.
     *
     * @return True when the same
     */
    equals(obj: any): boolean;

    /**
     * Destroy this {@link Semver}.
     */
    finalize(): void;

    /**
     * Check if this {@link Semver} is greater than the specified one.
     *
     * @param another To compare to.
     * @return True when greater
     */
    gt(another: Semver): boolean;

    /**
     * Check {@link Semver} compatibility.
     *
     * @param version To check.
     * @return True if compatible versions
     */
    isCompatible(version: Semver): boolean;

    /**
     * Check if this {@link Semver} is less than the specified one.
     *
     * @param another To compare to.
     * @return True when less than
     */
    lt(another: Semver): boolean;

    /**
     * Get the next {@link Semver} regarding specified {@link VersionType}.
     *
     * @param type The version type.
     * @return The next version
     */
    next(type: VersionType | number): Semver;

    /**
     * Return this {@link Semver} string representation.
     *
     * @return A string that represent this instance
     */
    toString(): string;

    /**
     * Test the version validity.
     *
     * @param version To check.
     * @return True if valid
     */
    validate(version: string): boolean;
}

export default Semver;
