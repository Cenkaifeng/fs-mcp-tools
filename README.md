# fs-mcp-tools

## 功能模块

### get_weather 天气查询
- 支持通过地理位置获取实时天气数据
- 提供温度、湿度、风速等详细信息

### get_time 时间获取
- 获取系统当前时间
- 支持时区转换功能

### change_file 文件操作
- 安全的文件读写权限控制
- 支持文本文件内容修改

## 使用说明

### 安装
```bash
npm install
```

### 构建
```bash
npm run build
```

### 运行
```bash
npm start
```

## 注意事项
⚠️ 文件操作受以下限制：
1. 仅允许操作工作目录内文件
2. 禁止修改系统关键路径
3. 文件大小限制为10MB以内