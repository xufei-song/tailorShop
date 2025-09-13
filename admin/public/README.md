# Admin Public 静态资源目录

## Favicon 设置

要解决 `http://localhost:3001/favicon.ico` 找不到的问题，请按以下步骤操作：

### 方法一：使用在线工具生成 favicon
1. 访问 https://favicon.io/ 或 https://realfavicongenerator.net/
2. 上传您的 logo 图片或使用文字生成器
3. 下载生成的 favicon.ico 文件
4. 将 favicon.ico 文件放置在此目录下

### 方法二：从现有项目复制
1. 从 shop/public 目录复制 favicon.ico（如果存在）
2. 或从其他 Next.js 项目复制

### 方法三：使用简单的默认图标
1. 创建一个 16x16 或 32x32 像素的 ICO 文件
2. 命名为 favicon.ico 并放置在此目录

## 其他静态资源
- 图片文件（.jpg, .png, .gif 等）
- 字体文件（.woff, .woff2 等）
- 其他静态资源文件

所有放在此目录下的文件都可以通过 `http://localhost:3001/文件名` 访问。
