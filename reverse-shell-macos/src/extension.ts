import * as vscode from 'vscode';
import { platform } from 'node:process';
import * as cp from 'node:child_process';

export function activate(context: vscode.ExtensionContext) {

	let command = vscode.commands.registerCommand('reverse-shell-macos.sendReverseShell', () => {
		
		if (platform !== "darwin") { console.error("Error: Not running on MacOS"); return; }
		
		cp.exec("osascript -e ");

	});

	context.subscriptions.push(command);
}

export function deactivate() {}
