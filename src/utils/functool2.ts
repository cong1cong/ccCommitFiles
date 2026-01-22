import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
export const functool2 = async ({
    workspacePath
}:{
    workspacePath:string;//项目相对路径
}) => {

    // 如果是功能2的话
    // 获取当前编辑器所打开的文件需要提取的文件
    console.log('获取当前编辑器所打开的文件需要提取的文件')

    // 获取当前活动的编辑器
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('没有打开的文件');
        return;
    }

    console.log(activeEditor)
    const sourceUri = activeEditor.document.uri;
    const fileName = path.basename(sourceUri.fsPath);

    // 计算文件相对于工作区的相对路径
    const relativePath = path.relative(workspacePath, sourceUri.fsPath);

    // 选择目标目录
    const targetUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: '选择导出目录'
    });
    if (!targetUri || targetUri.length === 0) return;
    const targetDir = targetUri[0].fsPath;//目标路径

    // 构建目标文件路径，保持原有的目录结构
    const targetFilePath = path.join(targetDir, relativePath);
    const targetFileUri = vscode.Uri.file(targetFilePath);

    try {
        // 使用VS Code的文件系统API复制文件
        await vscode.workspace.fs.copy(sourceUri, targetFileUri, { overwrite: true });

        vscode.window.showInformationMessage(`成功复制文件 ${relativePath} 到 ${targetDir}`);

        // 可选：打开目标目录
        // await openDirectoryInExplorer(targetDir);
    } catch (error) {
        vscode.window.showErrorMessage(`复制文件失败: ${error}`);
    }


}
