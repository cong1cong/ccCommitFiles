import * as vscode from "vscode";
export const statusBarHandler = (context: vscode.ExtensionContext) => {
  const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left,100)
  context.subscriptions.push(myStatusBarItem)
  myStatusBarItem.tooltip = 'ccCommitFiles'
  myStatusBarItem.command = 'ccCommitFiles.extract'
  myStatusBarItem.text = '🚀cc🚀'
  myStatusBarItem.color = new vscode.ThemeColor('statusBar.foreground')
  myStatusBarItem.backgroundColor = new vscode.ThemeColor('statusBar.background')
  myStatusBarItem.show()
  return myStatusBarItem;
};
