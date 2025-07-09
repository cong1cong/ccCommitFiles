## 描述
 
 
### 适用范围

    - 线上没上git管理的文件，需要手动上传（上线）代码 && 测试服上了git管理或本地有git

### 使用

    1. 快捷键ctrl+shift+p 输入ccCommitFiles，没找到的话输入ccCommitFiles.extract
    2. 选择需要把文件提取到的指定目录
    3. 选择需要提取文件的commit提交id 比如“ee9b1556c29”
    4. 插件将会自动提取，并复制源文件在项目中的相对路径

### 预期结果

	快速导出Git提交中文件的VSCode插件
	
### 核心

    1. 插件脚本执行git diff-tree --no-commit-id --name-only -r 'hash' 命令行输出该提交修改过的文件的树（相对文件路径）
    2. 使用换行符切割命令行输出的结果转为数组，循环路径，git show 'hash':'filePath' 命令行输出文件内容，并将结果写入文件