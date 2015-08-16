# net-fuse

Provides an interface to mount N folders (remote or local) to a local folder, as well as the
accompanying server.  What can you do with this?

- Transparently stream filesystems over a network (why this was built -- the rest are actually
  side-effects)
- Transparently merge folders on a local filesystem
- Create a RAID controller of sorts
- Create an "invisible" hard link
- Mount a web-service as a filesystem (if it implements the necessary grpc services)
- I dunno, be creative ;)

## Installation

```bash
npm install -g net-fuse
```

To use the server, or to access the node client API, you can also install or link it locally:

```bash
npm install net-fuse
```
```bash
npm link net-fuse
```

### Dependencies

Clients require FUSE for OSX or Linux.  Servers have no external dependencies.

#### OSX

You need to install any of the Fuse implementations for OSX. OSXFuse is the one that has been used
throughout the net-fuse development. Go to http://osxfuse.github.com/ and follow the instructions to
get it installed. Additionally, the FuseJS implementation that net-fuse uses uses `pkg-config`,
which you need to have installed on your system in order to compile FuseJS. It should come by
default in your operating system. If not, then use your package manager to install it:

```bash
brew install pkg-config
```

or

```bash
sudo port install pkg-config
```

#### Linux

Install libfuse-dev:

```bash
sudo apt-get install libfuse-dev
npm install fusejs
```

## Usage

``net-fuse --help``

### Node.js usage

All node options are identical to the command line options above, just passed as an object and with
  the directories under a `directories` key.  You can use the short or long names (if both are
  defined, the long name is used):

```js
var netFuse = require('net-fuse');
netFuse({
  server      : true,
  p           : 'r'
  directories : ['/local/path:/hosted/path', '/local/path2:/hosted/path2']
});
```

Or if you prefer, you can simply use the same commands as the command-line API:

```js
netFuse('-S -p=r /local/path:/hosted/path /local/path2:/hosted/path2');
```

The JS API returns a promise that (almost always) resolves with no response, or rejects with and
error likely containing the POSIX error code.  The only method, at the moment, that generates data
in the response is `status` (and I suppose `help`/`version`, but why you'd be calling those from
node I have no idea ;)).

## Directory Conflict Resolution

Since both the client and server are capable of mounting multiple directories at the same mount
points, it is possible (if not likely) for conflicts to arise.  Conflicts are resolved using the
following rules:

### Specificity Rules:

Specificity is defined as the number of folders matching the given path.

Example, writing to a file at `/foo/bar/baz.txt`, folders mounted at the following points
will provide specificity levels:

```
/          # 1
/foo       # 2
/foo/bar   # 3
/foo/other # 0
```

- most   -- Files are relative to the most specific directory that matches.
- any    -- Any directory with a specificity > 0.

### Conflict Rules

Conflicts arise when multiple directories pass the specificity rule.

- first  -- Files are relative to the first directory.
- all    -- Files are relative to every directory.  Fails with first failure code from any.
- any    -- Files are relative to every directory.  Succeeds with the first success code from any.
- quorum -- Writes go to all and succeed when the majority succeed.  Reads succeed when the majority
            of directories must report the same thing, otherwise they throw EFAULT.

### Operation Rules

Each type of file operation (`read`, `write`, `append`, `create`) can have it's own rules defined.
You can optionally define rules for each client op (`chmod`, `create`, `getattr`, `mkdir`, `open`,
  `read`, `readdir`, `readlink`, `release`, `rename`, `rmdir`, `statfs`, `unlink`, `write`)

Defaults are:

```
read   : { "specificity": "any",  "conflict": "any" }
write  : { "specificity": "most", "conflict": "any" }
append : { "specificity": "most", "conflict": "any" }
create : { "specificity": "most", "conflict": "any" }
```

### Server vs Client resolution

The server and client both resolve independently, without awareness of how the other is configured.

## Server vs Client versioning

The server and client must be on the same _major_ version (e.g. `1.x.x`), though a warning will be
thrown if the minor version mis-matches (`1.1.x` vs `1.2.x`).
