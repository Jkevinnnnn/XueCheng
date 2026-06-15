# XueCheng Plus Project

学成在线是一个面向在线教育场景的微服务项目，覆盖课程内容管理、媒资管理、课程发布、搜索、认证授权、选课学习、订单支付等核心流程。项目包含后端 Spring Cloud 微服务、前端管理端与门户页面、数据库初始化脚本和本地调试脚本，适合用于微服务开发学习、课程项目复盘和面试展示。

## 项目展示

### 业务功能框架

![业务功能框架](docs/images/business-framework.png)

### 平台技术架构

![平台技术架构](docs/images/platform-architecture.png)

### 课程发布流程

![课程发布流程](docs/images/course-publish-flow.png)

### 内容管理数据模型

![内容管理数据模型](docs/images/content-data-model.png)

## 核心功能

- 课程内容管理：课程基本信息、课程营销信息、课程计划、课程师资、课程审核与发布。
- 媒资管理：图片、视频等教学资源上传、管理、预览和视频处理。
- 课程搜索：课程索引构建、课程检索和门户课程列表查询。
- 认证授权：统一登录、JWT 令牌、网关鉴权和资源服务权限控制。
- 选课学习：课程详情、在线学习、学习记录、我的课程。
- 订单支付：选课下单、订单管理、支付接口测试和支付结果处理。
- 系统管理：分类管理、数据字典、权限相关基础数据。
- 任务调度与消息：课程发布、视频处理等异步任务和消息处理。

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 后端 | Java、Spring Boot、Spring Cloud、Spring Security、OAuth2/JWT |
| 数据访问 | MyBatis-Plus、MySQL |
| 微服务基础设施 | Nacos、Gateway、Redis |
| 媒资与文件 | MinIO、视频处理任务 |
| 搜索与消息 | Elasticsearch、消息表、任务调度 |
| 前端 | Vue、TypeScript、静态门户页面 |
| 构建与工具 | Maven、Docker、XXL-JOB、接口测试 HTTP 文件 |

## 系统架构

项目采用前后端分离和微服务拆分方式组织。前端通过网关访问后端接口，网关统一处理路由、跨域和认证鉴权。后端按业务领域拆分为内容、媒资、搜索、学习、订单、认证、系统管理等服务，各服务通过数据库、缓存、文件存储、搜索引擎和消息任务协作完成完整业务流程。

课程发布是项目中的关键链路：教学机构维护课程信息和媒资，运营端进行课程审核，审核通过后生成课程发布信息，同步缓存、搜索索引和门户静态页面，最终面向用户端展示并支持在线学习。

## 项目结构

```text
.
├── api-test/                         # 接口测试请求文件
├── database/sql/                     # 数据库初始化脚本
├── docs/images/                      # README 展示图片
├── frontend/
│   ├── project-xczx2-portal-vue-ts/  # Vue 前端项目
│   └── xc-ui-pc-static-portal/       # 静态门户页面
├── scripts/                          # 本地辅助脚本
├── xuecheng-plus-auth/               # 认证授权服务
├── xuecheng-plus-base/               # 公共基础模块
├── xuecheng-plus-checkcode/          # 验证码服务
├── xuecheng-plus-content/            # 课程内容服务
├── xuecheng-plus-gateway/            # 网关服务
├── xuecheng-plus-generator/          # 代码生成工具
├── xuecheng-plus-learning/           # 学习中心服务
├── xuecheng-plus-media/              # 媒资服务
├── xuecheng-plus-message-sdk/        # 消息 SDK
├── xuecheng-plus-orders/             # 订单服务
├── xuecheng-plus-parent/             # 父工程与依赖管理
├── xuecheng-plus-search/             # 搜索服务
├── xuecheng-plus-system/             # 系统管理服务
└── pom.xml                           # 根 Maven 聚合工程
```

## 模块说明

| 模块 | 说明 |
| --- | --- |
| `xuecheng-plus-parent` | 管理 Spring Boot、Spring Cloud、MyBatis、工具库等公共依赖版本。 |
| `xuecheng-plus-base` | 存放通用模型、异常处理、工具类和公共响应结构。 |
| `xuecheng-plus-auth` | 提供用户认证、授权、JWT 令牌签发等能力。 |
| `xuecheng-plus-gateway` | 统一入口，负责请求转发、认证过滤和网关路由。 |
| `xuecheng-plus-content` | 课程基本信息、课程计划、课程师资、课程发布等核心内容业务。 |
| `xuecheng-plus-media` | 媒资文件管理、上传、视频处理和任务调度相关能力。 |
| `xuecheng-plus-search` | 课程搜索和索引同步相关能力。 |
| `xuecheng-plus-learning` | 用户选课、在线学习和学习记录相关业务。 |
| `xuecheng-plus-orders` | 订单创建、订单查询、支付流程和支付回调处理。 |
| `xuecheng-plus-system` | 分类、数据字典、系统基础数据管理。 |
| `xuecheng-plus-checkcode` | 图片验证码等校验能力。 |
| `xuecheng-plus-message-sdk` | 消息处理公共组件，用于异步任务和事务消息场景。 |
| `xuecheng-plus-generator` | MyBatis-Plus 代码生成工具。 |

## 数据库脚本

数据库初始化脚本位于 `database/sql/`：

- `xcplus_content.sql`：课程内容库。
- `xcplus_media.sql`：媒资库。
- `xcplus_users.sql`：用户与认证相关数据。
- `xcplus_learning.sql`：学习中心数据。
- `xcplus_orders.sql`：订单数据。
- `xcplus_system.sql`：系统管理数据。
- `mq_message.sql`、`mq_message_history.sql`：消息表与历史消息表。

## 本地运行

### 环境准备

建议提前准备以下环境：

- JDK 8 或兼容版本
- Maven
- MySQL
- Redis
- Nacos
- MinIO
- Elasticsearch
- XXL-JOB
- Node.js / npm

### 后端启动

1. 创建数据库并导入 `database/sql/` 下的脚本。
2. 启动 Nacos、Redis、MinIO、Elasticsearch、XXL-JOB 等依赖服务。
3. 根据本地环境修改各服务中的 `bootstrap.yml` 或 `application.yml`，重点检查数据库、Nacos、Redis、MinIO、网关地址等配置。
4. 在项目根目录执行 Maven 构建：

```bash
mvn clean install
```

5. 按业务需要启动对应服务。常见启动顺序：

```text
Nacos / MySQL / Redis / MinIO / Elasticsearch
-> xuecheng-plus-gateway
-> xuecheng-plus-auth
-> xuecheng-plus-system
-> xuecheng-plus-content
-> xuecheng-plus-media
-> xuecheng-plus-search
-> xuecheng-plus-learning
-> xuecheng-plus-orders
```

### 前端启动

前端源码位于 `frontend/project-xczx2-portal-vue-ts/`：

```bash
cd frontend/project-xczx2-portal-vue-ts
npm install
npm run serve
```

静态门户页面位于 `frontend/xc-ui-pc-static-portal/`，可结合本地静态服务或 `scripts/static-portal-server.js` 进行调试。

## 接口测试

接口测试文件位于 `api-test/`，可以使用 IntelliJ IDEA HTTP Client、VS Code REST Client 或同类工具直接发送请求。调试前请确认网关、认证服务和目标业务服务已经启动，并根据本地端口调整请求地址。

## 项目亮点

- 微服务领域拆分清晰，课程、媒资、学习、订单、认证等模块边界明确。
- 使用网关统一接入请求，结合 JWT 完成认证授权。
- 课程发布链路覆盖数据入库、审核、缓存、搜索索引和门户展示。
- 媒资管理支持文件上传、视频处理和异步任务调度。
- 通过消息表和任务调度处理长流程业务，降低服务间强耦合。
- 前端管理端、静态门户、后端服务和数据库脚本相对完整，便于端到端联调。

## 注意事项

- 仓库已忽略 `node_modules/`、`target/`、`dist/`、日志和临时文件等构建产物。
- 配置文件中可能包含本地开发地址，首次运行前需要按自己的环境调整。
- 部分服务依赖外部中间件，单独启动某个业务服务前请先检查依赖是否就绪。
- 如果 GitHub 首页图片没有立即刷新，可以等待片刻或强制刷新浏览器缓存。
