let path     = require('path');

let fuse     = require('fusejs');
let inodes   = require('./inodes');
let services = require('./service');

class NetFuse extends fuse.FileSystem {
  getAttr(context, inode, reply) {
    services.NetFuse.getattr({
      path : inodes.getPath(inode)
    }).then(function(stat) {
      reply.attr(stat, 5);
    }).catch(function(err) {
      reply.err(err.posix.posix);
    });
  }

  opendir(context, inode, fileInfo, reply) {
    reply.open(fileInfo);
  }

  // releasedir(context, inode, fileInfo, reply) {
  //
  // }

  readdir(context, inode, requestedSize, offset, fileInfo, reply) {
    let dirPath = inodes.getPath(inode);

    services.NetFuse.readdir({
      path : dirPath
    }).then(function(files) {
      let size = Math.max(requestedSize, files.length * 256);

      files.forEach(function(file) {
        reply.addDirEntry(file, size, {inode : inodes.getiNode(path.join(dirPath, file))}, offset);
      });

      reply.buffer(new Buffer(0), files.length ? requestedSize : 0);
    }).catch(function(err) {
      reply.err(err.posix.posix);
    });
  }

  // setattr(context, inode, attrs, reply) {
  //
  // }

  open(context, inode, fileInfo, reply) {
    let flags = fileInfo.flags;

    if (flags.rdonly) {

    }
  }

  read(context, inode, len, offset, fileInfo, reply) {
    let filePath = inodes.get(inode);

    services.NetFuse.read({
        path     : filePath
      , position : offset
      , length   : len
    }).then(function(files) {

    });
  }

  write(context, inode, buffer, position, fileInfo, reply) {

  }

  // flush(context, inode, fileInfo, reply) {
  //
  // }

  mkdir(context, parentInode, name, mode, reply) {

  }

  rmdir(context, parentInode, name, reply) {

  }

  mknod(context, parentInode, name, mode, rdev, reply) {

  }

  create(context, parentInode, name, mode, fileInfo, reply) {

  }

  unlink(context, parentInode, name, reply) {

  }

  // release(context, inode, fileInfo, reply) {
  //
  // }

  statfs(context, inode, reply) {

  }

  // getxattr(context, parentInode, name, size, position, reply) {
  //
  // }

  // listxattr(context, inode, size, reply) {
  //
  // }

  access(context, inode, mask, reply) {

  }

  rename(context, oldParentInode, oldName, newParentInode, newName, reply) {

  }

  lookup(context, parentInode, name, reply) {

  }

}

module.exports = NetFuse;
