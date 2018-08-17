# 内容介绍

掘金小册的配套章节案例教程

进入相关的工程，请自行执行 `npm i` 安装项目库的基础依赖，并在有 .env.example 的项目中，复制一份 .env 配置项

## FAQ

### 教程章节里的代码案例启无法启动怎么办？

1. node_modules有了，但还是服务启动失败？

检查项目工程更目录下是否有 .env 文件，没有则从 .env.example 复制一枚，改名 .env，填入适当的配置值

```bash
cp .env.example .env
```