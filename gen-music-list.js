// 音乐列表生成脚本 - 支持子目录扫描
import fs from 'fs'
import path from 'path'

// 支持的音频文件扩展名
const AUDIO_EXTENSIONS = ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac']

// 递归扫描目录函数
function scanDirectory(dir, baseDir = '') {
  let musicFiles = []
  
  // 读取目录内容
  const items = fs.readdirSync(path.join(dir, baseDir), { withFileTypes: true })
  
  // 遍历目录项
  for (const item of items) {
    const relativePath = path.join(baseDir, item.name)
    const fullPath = path.join(dir, relativePath)
    
    if (item.isDirectory()) {
      // 如果是目录，递归扫描
      const subDirFiles = scanDirectory(dir, relativePath)
      musicFiles = [...musicFiles, ...subDirFiles]
    } else if (item.isFile()) {
      // 如果是文件，检查扩展名
      const ext = path.extname(item.name).toLowerCase()
      if (AUDIO_EXTENSIONS.includes(ext)) {
        // 提取文件名作为标题（不含扩展名）
        const title = path.basename(item.name, ext)
        
        // 添加到音乐文件列表
        musicFiles.push({
          title: title,
          src: '/' + relativePath // 使用相对路径，前面加/
        })
      }
    }
  }
  
  return musicFiles
}

// 主函数
function generateMusicList() {
  const publicDir = path.resolve('./public')
  console.log(`扫描目录: ${publicDir}`)
  
  try {
    // 扫描public目录及其子目录
    const musicFiles = scanDirectory(publicDir)
    
    // 按标题排序
    musicFiles.sort((a, b) => a.title.localeCompare(b.title))
    
    // 写入JSON文件
    const outputPath = path.join(publicDir, 'music-list.json')
    fs.writeFileSync(outputPath, JSON.stringify(musicFiles, null, 2))
    
    console.log(`成功生成音乐列表，共 ${musicFiles.length} 首歌曲`)
    console.log(`文件已保存至: ${outputPath}`)
  } catch (error) {
    console.error('生成音乐列表时出错:', error)
  }
}

// 执行生成
generateMusicList()