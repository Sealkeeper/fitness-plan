# 人体肌肉探索

训练页面底部的 Three.js 交互区，使用真实 BodyParts3D / Z-Anatomy 解剖网格。支持中英文搜索、身体部位与健康目标筛选、点击肌肉、前后侧视图、局部观察、透视、单独显示、自动旋转、标注、全屏，以及关联本页的动作详情。

## 使用

直接用 Chrome / Edge 打开 `训练计划.html`，或继续使用现有的 `启动.bat` / `serve.py`。HTML 本身包含全部模型数据，在只提供单一文件的预览器中也无需旁边的 assets 文件夹。无需安装 Node.js，运行时不访问外部 CDN。

模型数据以不执行的 JSON 嵌入页面，探索区域接近屏幕可见范围时才解析并创建三维网格；离开探索区域或切到其他标签页时停止绘制。静止的画面仅在内容或视角变化时重绘。普通滚轮继续滚动页面；模型缩放使用按钮、触控双指或 Ctrl + 滚轮。

原页面和「导出」生成的文件都包含完整模型，无需 assets 目录、网络或本地服务。包内含约 15 MB 模型数据，因此比普通训练页面大。浏览器 localStorage 仍只保存可编辑的训练文档；本地服务写回完整 HTML 时会保留嵌入的模型。

探索界面放在可编辑 `#doc` 外，避免 Canvas、WebGL 和详情界面进入训练计划的 localStorage、导入与自动保存。运行时代码和样式嵌入 HTML，确保导出完整、保持本项目既有的单页使用方式。打印时隐藏交互区。

## 修改界面

```sh
cd anatomy
npm ci
npm run build
```

- `viewer.js`：界面、Three.js 场景、拾取、模型解码及导出接口。
- `muscles.js`：主要肌群的筛选、中文位置/功能说明及网格名称匹配。
- `health.js`：肌肉健康关联、健康主题与专业来源；肌肉库和三维详情共用。
- `viewer.css`：桌面与移动布局；三维样式限定在 `#anatomy-explorer`，`mh-` 样式供肌肉库共用。
- `build.mjs`：把生成的代码和样式更新到 `训练计划.html`；不要手动编辑生成的 runtime 和样式块。
- `prepare-models.mjs`：从源模型重建压缩的 `models.js`，见下文。

浏览器回归检查（需 Python 的 `playwright` 和 Chromium）：

```sh
python verify.py --chromium /usr/bin/chromium
```

检查健康主题、头痛证据边界、名称覆盖、筛选与三维跳转、离线健康内容、真实网格点选、深层肌群、动作弹窗、保存隔离、断网时的单文件资源完整性、重复导出及手机布局。测试使用只读临时服务，不会把训练修改写回原文件。

Three.js 使用量化 GLB 时，必须先把 normalized 整数坐标转换为 Float32，再应用世界坐标和共同的解剖坐标转换；否则对整数属性写入毫米坐标会溢出。肌肉和骨骼共享转换中心与尺度，保留两者空间关系。

## 重建模型

取得 [BodyExplorer](https://github.com/JohanBellander/BodyExplorer) 的原始 `public/anatomy.glb`、`public/skeleton.glb` 和 `public/mesh_mapping.json` 后，运行：

```sh
node prepare-models.mjs /path/to/BodyExplorer/public
```

原始版本、处理参数和模型许可见 `../assets/anatomy/ATTRIBUTION.md`。代码运行所需的第三方 MIT 许可随 runtime 嵌入，另存于 `THIRD_PARTY_LICENSES.txt`。

## 健康介绍的编辑原则

健康内容核对日期为 2026-10-07。头痛区分颈源性、紧张型和偏头痛；不把颈部肌肉训练描述成增加脑供血。疾病康复证据针对确诊人群及组合方案，肌肉作用注明为解剖/功能关联，不赋予单块肌肉独立治疗效果。肌肉库的旧 `desc` 由构建脚本同步替换，避免遗留未经支持的医疗说法。相关动作是健身参考，并非自动生成的康复处方。

新增或更新资料时应核对原始指南或论文的适用人群、结局、确定性和局限，再调整 `health.js` 的证据说明；每块肌肉应保留具体的功能角色。所有外链仅在用户打开来源时使用，健康正文与模型均支持离线查看。
