// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { functool2 } from './utils/functool2';
const execAsync = promisify(exec);


async function exportCommitFiles(workspacePath: string, commitHash: string, targetDir: string) {
	// 获取提交中的所有文件
	const { stdout } = await execAsync(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, { cwd: workspacePath });
	const files = stdout.trim().split('\n').filter(Boolean);

	// 导出每个文件
	for (const file of files) {
		try {
			const targetPath = path.join(targetDir, file);
			const dirname = path.dirname(targetPath);

			// 创建目录
			await fs.promises.mkdir(dirname, { recursive: true });

			// 获取文件在提交中的内容
			const { stdout: content } = await execAsync(`git show ${commitHash}:./${file}`, { cwd: workspacePath });

			// 写入文件
			await fs.promises.writeFile(targetPath, content);
		} catch (error) {
			console.error(`无法导出文件 ${file}: ${error}`);
		}
	}
}

async function openDirectoryInExplorer(path: string) {
    try {
        // 跨平台打开目录
        const command = process.platform === 'win32' 
            ? `explorer "${path}"`
            : process.platform === 'darwin'
                ? `open "${path}"`
                : `xdg-open "${path}"`;
        
        await execAsync(command);
    } catch (error) {
        vscode.window.showErrorMessage(`无法打开目录: ${error}`);
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ccCommitFiles" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('ccCommitFiles.extract', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const msg = 'ccccccc'
		console.log(msg)
		vscode.window.showInformationMessage('windom cc');

		// 获取当前工作区
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage('没有打开的工作区');
			return;
		}

		const workspacePath = workspaceFolders[0].uri.fsPath;

		// 选择功能
		const selectedFunction = await vscode.window.showQuickPick([
			{
				label: '提取git commit的文件',
				description: '从指定的git提交中导出所有修改的文件',
				detail: '选择此选项将让您输入commit哈希并导出相关文件',
				value: '1'
			},
			{
				label: '提取单个文件',
				description: '复制当前打开的文件到指定目录',
				detail: '选择此选项将复制当前编辑器中的文件，保持项目目录结构',
				value: '2'
			}
		], {
			placeHolder: '请选择要执行的功能',
			matchOnDescription: true,
			matchOnDetail: true
		});

		if (!selectedFunction) return;
		const funcToolFag = selectedFunction.value;
		if(String(funcToolFag) == '2'){
			return functool2({workspacePath})
		}

		// 让用户选择提交哈希
		const commitHash = await vscode.window.showInputBox({
			prompt: '输入要导出的提交哈希',
			placeHolder: '例如: a1b2c3d'
		});

		if (!commitHash) return;

		// 选择目标目录
		const targetUri = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: '选择导出目录'
		});

		if (!targetUri || targetUri.length === 0) return;

		const targetDir = targetUri[0].fsPath;

		// 执行导出
		try {
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: `正在导出提交 ${commitHash} 的文件...`,
				cancellable: false
			}, async () => {
				await exportCommitFiles(workspacePath, commitHash, targetDir);
				vscode.window.showInformationMessage(`成功导出提交 ${commitHash} 的文件到 ${targetDir}`);
			});
			// 打开目录
			// await openDirectoryInExplorer(targetDir)
		} catch (error) {
			vscode.window.showErrorMessage(`导出失败: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}



// This method is called when your extension is deactivated
export function deactivate() { }
