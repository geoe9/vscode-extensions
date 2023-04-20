import * as vscode from 'vscode';
import * as fs from 'fs';

export async function activate(context: vscode.ExtensionContext) {

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

	
	
}

export function deactivate() {}
