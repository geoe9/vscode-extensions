const NetcatServer = require('netcat/server');

const nc = new NetcatServer()

nc.port(6742).k().listen()