// Configure require.paths to load local copies of owned modules instead of npm installed versions
process.env.NODE_MODULES && require( 'app-module-path' ).addPath( process.env.NODE_MODULES );

var Program     = require( 'node-incoming' );
var packageJSON = require( './package.json' );
var fuse        = require( './lib' );

var server  = 'Server';
var client  = 'Client';
var port    = 12742; // default port number

var t;

var timeMults = {
    s : t  = 1000
  , m : t *= 60
  , h : t *= 60
  , d : t *= 24
  , y : t *= 365
};

var sizeMults = {
    b  : t   = 1
  , kb : t <<= 10
  , mb : t <<= 10
  , gb : t <<= 10
};

function parsePermissions( perm ){
  var permRx = /^[rw]{0,2}$/;

  if( !permRx.test( perm ) ){
    throw new TypeError();
  }

  return {
      r : !!~perm.indexOf( 'r' )
    , w : !!~perm.indexOf( 'w' )
  };
}

function unitMult( amount, sizes ){
  var units = /^(\d+)(\w+)?$/.exec( amount.toLowerCase() );

  if( !units || ( units[2] && !sizes[units[2]] ) ){
    throw new Error( 'Invalid amount: ' + amount );
  }

  return units[1] * ( sizes[units[2]] || 1 );
}

function parseFileSize( size ){
  return unitMult( size, timeMults );
}

function parseTime( time ){
  return unitMult( time, sizeMults );
}

var source = new Program()
  .version ( packageJSON.version )
  .rest    ( 'servers|directories' )
  .sock    ( '/tmp/net-fuse.sock' )

  .helpText( 'net-fuse mounts N directories (local or remote) to a local mount point' )
  .helpText( 'fuse-handlers', 'chmod, create, getattr, mkdir, open, read, readdir, readlink, release, rename, rmdir, ' +
                              'statfs, unlink, write' )

  .example ( 'net-fuse -S /local/path:/hosted/path /local/path2:/hosted/path2' )
  .example ( 'net-fuse -C -M /path/to/mount/to server.com:/relative/path server2.com:/relative/path2' )

  .option  ( { group : server, setsGroup : true }, '--server, -S', 'Set up a net-host server' )
  .option  ( { group : client, setsGroup : true }, '--client, -C', 'Set up a net-host client' )

  .option  ( '--unmount, -U',  'Unmounts the given directories in either client or server mode' )
  .option  ( '--status, -s',   'Shows all mounted directories'                                  )
  .option  ( '--shutdown, -X', 'Shuts down the client or server process (if any)'               )

  // General Options
  .option  ( '--permissions, -P [perm=rw]',   'One of "r", "rw", "w".  These are and-ed with file-' +
                                              'system permissions on the server.', parsePermissions, 'rw'  )
  .option  ( '--match, -m [globs]',           'File globs to serve/view'                                   )
  .option  ( '--ignore, -i [globs]',          'File globs to ignore'                                       )
  .option  ('--specificity, -s [rule=value]', 'Set a specificity rule (read, write, create, append, or'    +
                                              'any fuse handler) to a value (most, any).  e.g. '           +
                                              '-s read=most -s write=any.  Defaults to "any" for read, '   +
                                              'and "most" for others.'                                     )
  .option  ('--conflict, -o [rule=value]',    'Set a conflict rule (read, write, create, append, or any '  +
                                              'fuse handler) to a value (first, all, any, quorum).  e.g. ' +
                                              '-o read=first -o write=quorum.  Defaults to "any".'         )

  // Server Options
  .option  ( { group : server }, '--port, -p [port=' + port + ']',     'Port number to host grpc server on',                        Number,           port  )

  // Client Options
  .option  ( { group : client }, '--mount, -M [directory]',            'Root directory to mount all fuse clients onto'                                      )
  .option  ( { group : client }, '--cacheSize, -c [size=0]',           'Maximum size of all cached files.  N[b,kb,mb,gb]',          parseFileSize,    0     )
  .option  ( { group : client }, '--maxCachedFileSize, -f [size=1mb]', 'Maximum size of any one cached file.  N[b,kb,mb,gb]',       parseFileSize,    '1mb' )
  .option  ( { group : client }, '--cacheExpiry -e [time=5m]',         'Maximum time to hold cached files.  N[s,m,h,d,y]',          parseTime,        '5m'  )
  .option  ( { group : client }, '--writeThrottle, -w [time=0]',       'Throttle server writes to this time period.  N[s,m,h,d,y]', parseTime,        0     )
  .option  ( { group : client }, '--writeDebounce, -W [time=0]',       'Debounce server writes to this time period.  will only ' +
                                                                       'send to server after there hasn\'t been a write for ' +
                                                                       'this long.  N[s,m,h,d,y]',                                  parseTime,        0     )

  .processArgs() // deferred call to process command-line arguments

  .observable () // returns an RxJS observable
  ;

source.forEach( function( config ){
  fuse( config );
} );
