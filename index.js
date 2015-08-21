#!/usr/bin/env node

// Configure require.paths to load local copies of owned modules instead of npm installed versions
process.env.NODE_MODULES && require('app-module-path').addPath(process.env.NODE_MODULES);
('production' !== process.env.NODE_ENV) && require('babel/register')({sourceMap: 'inline', retainLines: true});

require('./lib/app');
