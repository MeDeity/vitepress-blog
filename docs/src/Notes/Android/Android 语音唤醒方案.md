---
title: "Android 语音唤醒方案"
outline: deep
desc: "Android 语音唤醒方案"
tags: "Android"
updateTime: "2024-10-28 10:00"
---

### 语音活动检测模型
企业级的语音活动检测器
项目: [silero-vad](https://github.com/snakers4/silero-vad)
演示应用: [APKs for VAD](https://k2-fsa.github.io/sherpa/onnx/vad/apk-cn.html)

### 语音意图和插槽检测

本仓库实现了一个基于BERT的意图（intent）和槽位（slots）联合预测模块。想法上与[JoinBERT](https://arxiv.org/abs/1902.10909)类似，利用 `[CLS]` token对应的last hidden state去预测整句话的intent，并利用句子tokens的last hidden states做序列标注，找出包含slot values的tokens
1. [bert-intent-slot-detector](https://github.com/Linear95/bert-intent-slot-detector)


### 参考链接
1. [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx)
2. [Build sherpa-onnx for Android](https://k2-fsa.github.io/sherpa/onnx/android/build-sherpa-onnx.html)