# 音乐网站

## 项目简介
本项目是一个基于 Vue3 + Vite 的简洁音乐播放网站，支持本地音乐文件的展示与播放，具备顺序、单曲循环、随机等多种播放模式。

## 使用方法

### 1. 安装依赖
在项目根目录下执行：
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
启动后访问终端输出的本地地址（如 http://localhost:5173/ ）。

### 3. 添加音乐文件
将你的音频文件（支持 .mp3、.flac、.wav、.ogg、.aac、.m4a 等格式）放入 `public/` 目录下。文件名建议使用"歌手 - 歌曲名.格式"方式，便于识别。

### 4. 自动生成音乐列表
项目根目录下有 `gen-music-list.js` 或 `gen-music-list.cjs` 脚本，用于自动扫描 `public/` 目录下的音频文件并生成 `music-list.json` 文件。

执行命令：
```bash
node gen-music-list.js
```
或
```bash
node gen-music-list.cjs
```

生成后，`public/music-list.json` 会自动被加载，无需手动编辑。

### 5. 常见问题
- **Q: 新增音乐后没有显示？**
  A: 请重新运行 `node gen-music-list.js` 生成最新的 `music-list.json`。
- **Q: 音乐无法播放？**
  A: 请确认音频文件格式浏览器支持，文件路径无误。
- **Q: 如何切换播放模式？**
  A: 播放器界面有播放模式切换按钮，支持顺序、单曲循环、随机。

## 依赖环境
- Node.js 16 及以上
- npm 8 及以上

## 打包与部署

### 1. 打包项目
在项目根目录下执行：
```bash
npm run build
```

执行后会在项目根目录下生成 `dist` 文件夹，里面包含了所有静态资源文件。

### 2. 部署方法

#### 静态服务器部署
将 `dist` 目录下的所有文件复制到您的静态服务器（如 Nginx、Apache）的网站根目录下即可。

#### 使用 Node.js 服务器
可以使用 `serve` 等工具快速部署：
```bash
npm install -g serve
serve -s dist
```

### 3. 域名配置
如需配置自定义域名访问，需要修改 `vite.config.js` 文件，添加 `server.host` 和 `server.proxy` 配置：

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {},
    // 添加允许的域名
    hmr: {
      clientPort: 5173,
      host: 'music.1895.cn'
    },
    // 允许的域名列表
    allowedHosts: ['music.1895.cn']
  }
})
```

配置后，您可以通过 `music.1895.cn` 域名访问您的音乐网站（需要确保 DNS 已正确解析到您的服务器 IP）。

## 其他

如遇问题欢迎提 issue。
