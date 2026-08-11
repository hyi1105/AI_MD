# SEED — 原生 iPhone App（Hello World）

SwiftUI 專案，畫面對齊網站首頁：品牌 **SEED**＋**Hello World**。

> 此環境是 Linux，**無法在此編譯或模擬 iOS**。請在 **Mac＋Xcode 15+** 開啟執行。

## 在 Mac 上執行

1. 用 Xcode 開啟 `SEED.xcodeproj`
2. 上方選一個 iPhone 模擬器（或接真機）
3. 按 Run（▶）
4. 應看到 SEED／Hello World 與綠色氛圍背景

真機：在 Signing & Capabilities 選你的 Apple ID Team；Bundle ID 預設 `com.hyi1105.SEED`（可改）。

## 結構

```text
ios/
├── README.md
├── SEED.xcodeproj/
└── SEED/
    ├── SEEDApp.swift
    ├── ContentView.swift
    └── Assets.xcassets/
```

## 注意

- 最低 iOS 17
- 尚未上架 App Store（需開發者帳號與審核，另案）
- App Icon 目前為空白占位，可之後在 Assets 補 1024×1024
