import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
const execAsync = promisify(exec);
import * as fs from "fs";
import * as vscode from "vscode";

export async function exportCommitFiles(workspacePath: string, commitHash: string, targetDir: string) {
  // 获取提交中的所有文件
  const { stdout } = await execAsync(`git diff-tree --no-commit-id --name-only -r ${commitHash}`, { cwd: workspacePath });
  const files = stdout.trim().split("\n").filter(Boolean);

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

export async function openDirectoryInExplorer(path: string) {
  try {
    // 跨平台打开目录
    const command = process.platform === "win32" ? `explorer "${path}"` : process.platform === "darwin" ? `open "${path}"` : `xdg-open "${path}"`;

    await execAsync(command);
  } catch (error) {
    vscode.window.showErrorMessage(`无法打开目录: ${error}`);
  }
}
