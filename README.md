# versionjs
A basic Semantic Versioning ([semver](https://semver.org/)) serializer and deserializer.

### Get Started
Run `npm install versionjs` in your terminal.

### Building
Run `npm run build` in your terminal.

### Testing
Run `npm run test` in your terminal.

### Generate doc
Run `npm run docs` in your terminal.

### Example

#### How to create a version:

```typescript 
    // custom
    const version: Semver = new Version({ major: 1, minor: 0, patch: 0 }); 
    const prefixVersion: Semver = new Version({ version: 'v1.0.0' });    
    // Or from helpers
    const firstRelease: Semver = Version.firstRelease;
    // From current release
    const bugFixes: Semver = firstRelease.bugFixes;
    const newFeatures: Semver = bugFixes.newFeatures;
    const breakChanges: Semver = newFeatures.breakChanges;
```

#### How to create a version with pre-release:

```typescript 
    const version: Semver = new Version({
        major: 1, minor: 0, patch: 0, preRelease: 'DEV-SNAPSHOT'
    });    
```

#### How to create a version with a build metadata:

```typescript 
    const version: Semver = new Version({
        major: 1, minor: 0, patch: 0, preRelease: 'DEV-SNAPSHOT', buildMetadata: 'meta'
    });    
```

#### How to create a version from string:

```typescript 
    const version: Semver = new Version({version: '10.2.3-DEV-SNAPSHOT+meta'});
```

#### How to modify an existing version:

```typescript 
    const v1: Semver = new Version({version: '10.2.3-DEV-SNAPSHOT+meta'});
    
    v1.major = 11;
    v1.minor = 3;
    v1.patch = 4;
    v1.preRelease = 'alpha';
    v1.buildMetadata = 'valid-meta';
    
    const v2: Semver = new Version({version: '10.3.3-DEV-SNAPSHOT+meta'});
    
    v2.version = '11.5.5-DEV-SNAPSHOT+meta';
    
    if (!v1.equals(v2)) {
        ...
    }
```

#### How to compare versions:

```typescript 
    const v1: Semver = new Version({version: '1.0.0-DEV-SNAPSHOT+meta'});
    const v2: Semver = new Version({version: '2.0.0-ALPHA-SNAPSHOT+meta'});
    
    if (v1.compareTo(v2) === -1) {
        ...
    }
    if (v1.lt(v2)) {
        ...
    }
    if (v2.gt(v1)) {
        ...
    }
    if (!v2.eq(v1)) {
        ...
    }
```



