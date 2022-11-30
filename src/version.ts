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

import Semver, {SpecialId, VersionType} from './semver';

/**
 * Separator for pre release.
 */
const PRE_RELEASE_SEPARATOR: string = '-';

/**
 * Separator for build metadata.
 */
const BUILD_METADATA_SEPARATOR: string = '+';

/**
 * Default version.
 */
const DEFAULT_VERSION: string = '0.0.0';

/**
 * Snapshot value.
 */
const SNAPSHOT_VERSION_SUFFIX: string = 'SNAPSHOT';

/**
 * Digit reg.
 */
const DIGITS_ONLY: RegExp = /\d+/;

/**
 * Dot reg.
 */
const DOT_SPLIT: RegExp = /\./;

// eslint-disable-next-line max-len
const FORMAT: RegExp = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][\da-zA-Z-]*))*))?(?:\+([\da-zA-Z-]+(?:\.[\da-zA-Z-]+)*))?$/gm;

/**
 * Illegal argument.
 */
const ILLEGAL_ARGUMENT_EXCEPTION = 'IllegalArgumentException';

/**
 * Ensure that a number is finite.
 *
 * @param value Number to check.
 * @param msg Message to use when needed.
 */
const assertIsFinite: (value: number, msg?: string) => asserts value =
    (value: number, msg?: string): asserts value => {
        if (!isFinite(value)) {
            throw new RangeError(msg ? msg : ILLEGAL_ARGUMENT_EXCEPTION);
        }
    };

/**
 * Ensure that a value is a number.
 *
 * @param value Number to check.
 * @param msg Message to use when needed.
 */
const assertNumber: (value: number, msg?: string) => asserts value =
    (value: number, msg?: string): asserts value => {
        if (isNaN(value)) {
            throw new RangeError(msg ? msg : ILLEGAL_ARGUMENT_EXCEPTION);
        }
    };

/**
 * Ensure that the specified value is greater than the limit.
 * @param value To check.
 * @param limit To ensure.
 * @param msg To use when needed.
 */
const assertGreater: (value: number, limit: number, msg?: string) => asserts value =
    (value: number, limit: number, msg?: string): asserts value => {
        if (value <= limit) {
            throw new RangeError(msg ? msg : ILLEGAL_ARGUMENT_EXCEPTION);
        }
    };


/**
 * A special identifier implementation for strings.
 *
 * @see SpecialId
 */
export class StringId implements SpecialId {
    private id: string = '';

    /**
     * Construct a string identifier.
     *
     * @param id An identifier.
     */
    constructor(id: string) {
        this.id = id;
    }

    /**
     * True when snapshot.
     */
    public get isSnapshot(): boolean {
        return this.id.endsWith(SNAPSHOT_VERSION_SUFFIX);
    }

    /**
     * @inheritDoc
     */
    public equals(obj: any): boolean {
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof StringId)) {
            return false;
        }

        return this.compareTo(obj as StringId) === 0;
    }

    /**
     * @inheritDoc
     */
    public clone(): SpecialId {
        return new StringId(this.id);
    }

    /**
     * @inheritDoc
     */
    public compareTo(other: SpecialId): number {
        if (other instanceof StringId) {
            const strId: StringId = other as StringId;
            if (strId.id === this.id) {
                return 0;
            }
            return this.id.localeCompare(strId.id);
        } else if (other instanceof IntId) {
            // Numeric identifiers always have lower precedence than non-numeric identifiers.
            return 1;
        }

        return -other.compareTo(this);
    }

    /**
     * @inheritDoc
     */
    public finalize(): void {
        this.id = '';
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return this.id;
    }
}


/**
 * A special identifier implementation for integers.
 *
 * @see SpecialId
 */
export class IntId implements SpecialId {
    private id: number = -1;

    /**
     * Construct an integer identifier.
     *
     * @param id An identifier.
     */
    constructor(id: number) {
        this.id = id;
    }

    /**
     * True when snapshot.
     */
    public get isSnapshot(): boolean {
        return false;
    }

    /**
     * @inheritDoc
     */
    public clone(): SpecialId {
        return new IntId(this.id);
    }

    /**
     * @inheritDoc
     */
    public compareTo(other: SpecialId): number {
        if (other instanceof IntId) {
            const intId: IntId = other as IntId;
            return this.id - intId.id;
        } else if (other instanceof StringId) {
            //Numeric identifiers always have lower precedence than non-numeric identifiers.
            return -1;
        }

        return -other.compareTo(this);
    }

    /**
     * @inheritDoc
     */
    public equals(obj: any): boolean {
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof IntId)) {
            return false;
        }
        const intId: IntId = obj as IntId;

        return intId.id === this.id;
    }

    /**
     * @inheritDoc
     */
    public finalize(): void {
        this.id = -1;
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return `${this.id}`;
    }
}

/**
 * A special metadata.
 *
 * @see SpecialId
 */
export class Special implements SpecialId {
    private readonly ids: Array<SpecialId> = [];
    private version: string = '';

    /**
     * Construct a special version.
     *
     * @param version Value.
     */
    constructor(version: string) {
        const parts: Array<string> = version.split(DOT_SPLIT);
        this.version = version;
        parts.forEach((part: string) =>
            this.ids.push(Special.parseSpecialId(part))
        );
    }

    /**
     * True for snapshot.
     */
    public get isSnapshot(): boolean {
        if (this.ids.length && this.last) {
            return this.last.isSnapshot;
        }

        return false;
    }

    /**
     * The latest identifier.
     */
    public get last(): SpecialId | undefined {
        return this.ids[this.ids.length - 1];
    }

    /**
     * Parse a special identifier.
     *
     * @param id An identifier.
     * @return A {@link SpecialId} instance
     */
    private static parseSpecialId(id: string): SpecialId {
        if (DIGITS_ONLY.test(id)) {
            return new IntId(parseInt(id, 10));
        }

        return new StringId(id);
    }

    /**
     * @inheritDoc
     */
    public clone(): Special {
        return new Special(this.version);
    }

    /**
     * @inheritDoc
     */
    public compareTo(other: Special): number {
        const min: number = Math.min(other.ids.length, this.ids.length);
        for (let i: number = 0; i < min; i++) {
            const c: number = this.ids[i].compareTo(other.ids[i]);
            if (c !== 0) {
                return c;
            }
        }
        const max: number = Math.max(other.ids.length, this.ids.length);
        if (max !== min) {
            return this.ids.length > other.ids.length ? 1 : -1;
        }

        return 0;
    }

    /**
     * @inheritDoc
     */
    public equals(obj: any): boolean {
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof Special)) {
            return false;
        }
        const special: Special = obj as Special;

        return special.version === this.version;
    }

    /**
     * @inheritDoc
     */
    public finalize(): void {
        this.ids.length = 0;
        this.version = '';
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return this.version;
    }
}

/**
 * Options used by {@link Version}.
 */
export interface VersionOptions {
    /**
     * The MAJOR version.
     */
    major?: number;
    /**
     * The MINOR version.
     */
    minor?: number;
    /**
     * The PATCH version.
     */
    patch?: number;
    /**
     * The PRERELEASE version.
     */
    preRelease?: string;
    /**
     * The BUILD METADATA version.
     */
    buildMetadata?: string;
    /**
     * The string version.
     */
    version?: string;
}

/**
 * Version following semantic defined by <a href='http://semver.org/'>Semantic Versioning</a> document.
 *
 * @see Semver
 */
export class Version implements Semver {
    private buildMetadataString: string | undefined;
    private preReleaseString: string | undefined;
    private specialBuildMetadata: Special | undefined;
    private specialPrerelease: Special | undefined;
    private versionComponents: Array<number> = new Array<number>(3).fill(0);
    private versionString: string = DEFAULT_VERSION;

    /**
     * Create version from input.
     *
     * @param options Used to construct instance.
     * @see VersionOptions
     */
    constructor(options: VersionOptions) {
        const {
            major, minor, patch, preRelease, buildMetadata, version
        }: VersionOptions = options;
        if (version) {
            this.version = version;
        } else {
            if (major !== undefined) {
                this.major = major;
            }
            if (minor !== undefined) {
                this.minor = minor;
            }
            if (patch !== undefined) {
                this.patch = patch;
            }
            if (preRelease !== undefined) {
                this.preRelease = preRelease;
            }
            if (buildMetadata) {
                this.buildMetadata = buildMetadata;
            }
            if (!this.validate(this.version)) {
                throw new SyntaxError(`${ILLEGAL_ARGUMENT_EXCEPTION} invalid <${this.version}> version.`);
            }
        }
    }

    /**
     * Build metadata MAY be denoted by appending a plus sign and a series
     * of dot separated identifiers immediately following the patch or pre-release version.
     * <p>
     * Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-].
     * <p>
     * Identifiers MUST NOT be empty. Build metadata MUST be ignored when determining
     * version precedence. Thus, two versions that differ only in the build metadata,
     * have the same precedence.
     *
     * @example 1.0.0-alpha+001, 1.0.0+20130313144700, 1.0.0-beta+exp.sha.5114f85,
     * 1.0.0+21AF26D3—-117B344092BD.
     */
    public get buildMetadata(): string | undefined {
        return this.buildMetadataString;
    }

    public set buildMetadata(buildMetadata: string | undefined) {
        this.buildMetadataString = buildMetadata;
        this.specialBuildMetadata = buildMetadata ? new Special(buildMetadata) : undefined;
        this.updateVersion();
    }

    /**
     * True when development version.
     */
    public get isInDevelopment(): boolean {
        return this.major === 0;
    }

    /**
     * True when SNAPSHOT version.
     */
    public get isSnapshot(): boolean {
        return this.specialPrerelease !== undefined && this.specialPrerelease.isSnapshot;
    }

    /**
     * True when stable version.
     */
    public get isStable(): boolean {
        return !this.isInDevelopment;
    }

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
    public get major(): number {
        return this.versionComponents[0];
    }

    public set major(major: number) {
        this.assertRange(major, 'major');
        this.versionComponents[0] = major;
        this.updateVersion();
    }

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
    public get minor(): number {
        return this.versionComponents[1];
    }

    public set minor(minor: number) {
        this.assertRange(minor, 'minor');
        this.versionComponents[1] = minor;
        this.updateVersion();
    }

    /**
     * Patch version Z (x.y.Z | x > 0) MUST be incremented if only backwards compatible
     * bug fixes are introduced.
     * <p>
     * A bug fix is defined as an internal change that fixes incorrect behavior.
     */
    public get patch(): number {
        return this.versionComponents[2];
    }

    public set patch(patch: number) {
        this.assertRange(patch, 'patch');
        this.versionComponents[2] = patch;
        this.updateVersion();
    }

    /**
     * A pre-release version that MAY be denoted by appending a hyphen and a series
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
    public get preRelease(): string | undefined {
        return this.preReleaseString;
    }

    public set preRelease(preRelease: string | undefined) {
        this.preReleaseString = preRelease;
        this.specialPrerelease = preRelease ? new Special(preRelease) : undefined;
        this.updateVersion();
    }

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
    public get version(): string {
        this.updateVersion();

        return this.versionString;
    }

    public set version(version: string) {
        const match: RegExpExecArray | null = FORMAT.exec(version);
        if (match) {
            try {
                const major: string | undefined = match[1];
                const minor: string | undefined = match[2];
                const patch: string | undefined = match[3];
                const preRelease: string | undefined = match[4];
                const buildMetadata: string | undefined = match[5];
                if (major) {
                    this.major = parseInt(major, 10);
                }
                if (minor) {
                    this.minor = parseInt(minor, 10);
                }
                if (patch) {
                    this.patch = parseInt(patch, 10);
                }
                if (preRelease) {
                    this.preRelease = preRelease;
                }
                if (buildMetadata) {
                    this.buildMetadata = buildMetadata;
                }
            } catch (e) {
                this.versionString = DEFAULT_VERSION;
            }
        } else {
            throw new SyntaxError(`${ILLEGAL_ARGUMENT_EXCEPTION} invalid <${version}> version.`);
        }
    }

    /**
     * Clone this {@link Version}.
     *
     * @return A {@link Semver} implementation
     */
    public clone(): Semver {
        return new Version({
            major: this.major,
            minor: this.minor,
            patch: this.patch,
            preRelease: this.preRelease,
            buildMetadata: this.buildMetadata
        });
    }

    /**
     * @inheritDoc
     */
    public compareTo(another: Semver): number {
        if (this.equals(another)) {
            return 0;
        }
        const version: Version = another as Version;
        if (this.major < version.major) {
            return -1;
        } else if (this.major === version.major) {
            if (this.minor < version.minor) {
                return -1;
            } else if (this.minor === version.minor) {
                if (this.patch < version.patch) {
                    return -1;
                } else if (this.patch === version.patch) {
                    if (this.specialPrerelease && version.specialPrerelease) {
                        return this.specialPrerelease.compareTo(version.specialPrerelease);
                    }
                    if (version.specialPrerelease) {
                        return 1;
                    } else if (this.specialPrerelease) {
                        return -1;
                    }
                    if (
                        (this.specialBuildMetadata && version.specialBuildMetadata) ||
                        (this.specialBuildMetadata && !version.specialBuildMetadata) ||
                        (!this.specialBuildMetadata && version.specialBuildMetadata)
                    ) {
                        return 0;
                    }
                    // else handled by previous equals check
                }
            }
        }

        return 1; //if this (major, minor or patch) is > than other
    }

    /**
     * @inheritDoc
     */
    public equals(obj: any): boolean {
        if (obj === this) {
            return true;
        }
        if (!(obj instanceof Version)) {
            return false;
        }
        const v: Version = obj as Version;
        if (v.major !== this.major || v.minor !== this.minor || v.patch !== this.patch) {
            return false;
        }

        return this.preRelease === v.preRelease &&
            this.buildMetadata === this.buildMetadata;
    }

    /**
     * @inheritDoc
     */
    public finalize(): void {
        this.versionString = DEFAULT_VERSION;
        this.versionComponents = new Array<number>(3).fill(0);
        this.specialBuildMetadata = undefined;
        this.specialPrerelease = undefined;
    }

    /**
     * @inheritDoc
     */
    public isCompatible(version: Semver): boolean {
        return this.major === version.major;
    }

    /**
     * @inheritDoc
     */
    public next(type?: number): Semver {
        if (!type) {
            throw new ReferenceError(`${ILLEGAL_ARGUMENT_EXCEPTION} null type`);
        }
        const hasSpecial: boolean = this.preRelease !== undefined || this.buildMetadata !== undefined;
        switch (type) {
            case VersionType.MAJOR:
                if (!hasSpecial || this.minor !== 0 || this.patch !== 0) {
                    return new Version({major: this.major + 1, minor: 0, patch: 0});
                }
                return new Version({major: this.major, minor: 0, patch: 0});
            case VersionType.MINOR:
                if (!hasSpecial || this.patch !== 0) {
                    return new Version({major: this.major, minor: this.minor + 1, patch: 0});
                }
                return new Version({major: this.major, minor: this.minor, patch: 0});
            case VersionType.PATCH:
                if (!hasSpecial) {
                    return new Version({major: this.major, minor: this.minor, patch: this.patch + 1});
                }
                return new Version({major: this.major, minor: this.minor, patch: this.patch});
            default:
                throw new SyntaxError(`${ILLEGAL_ARGUMENT_EXCEPTION} Unknown type <${type}>`);
        }
    }

    /**
     * @inheritDoc
     */
    public toString(): string {
        return this.version;
    }

    /**
     * @inheritDoc
     */
    public validate(version: string): boolean {
        return version.match(FORMAT) !== null;
    }

    /**
     * Range assertion.
     *
     * @param value To assert.
     * @param property Property to assert.
     */
    private assertRange(value: number, property: string): void {
        assertNumber(value, `IllegalArgumentException ${property} version must be a number`);
        assertIsFinite(value, `IllegalArgumentException ${property} version must be finite`);
        assertGreater(value, -1, `IllegalArgumentException ${property} version must be positive`);
    }

    /**
     * Update current version.
     */
    private updateVersion(): void {
        let versionString: string = '';
        if (this.major > -1) {
            versionString = `${this.major}`;
        }
        if (this.minor > -1) {
            versionString = `${versionString}.${this.minor}`;
        }
        if (this.patch > -1) {
            versionString = `${versionString}.${this.patch}`;
        }
        if (this.preRelease) {
            versionString = `${versionString}${PRE_RELEASE_SEPARATOR}${this.preRelease}`;
        }
        if (this.buildMetadata) {
            versionString = `${versionString}${BUILD_METADATA_SEPARATOR}${this.buildMetadata}`;
        }
        this.versionString = versionString;
    }
}


export default Semver;