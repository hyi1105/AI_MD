const AI_TOOLS = [];

async function loadCatalog() {
  if (AI_TOOLS.length) return AI_TOOLS;
  const res = await fetch("catalog.json");
  if (!res.ok) throw new Error("無法載入工具目錄");
  const data = await res.json();
  AI_TOOLS.push(...data);
  return AI_TOOLS;
}

/** 全球三大 AI 工具（官網重點整理 + 團隊評估） */
const TOP_TIER_IDS = ["chatgpt", "gemini", "claude"];

const TOP_TIER_EVALUATIONS = {
  chatgpt: {
    sourceSummary:
      "OpenAI 官網強調通用對話、寫作、程式、影像與語音等多模態能力，並提供免費與 Plus 訂閱方案。",
    pros: ["生態完整、上手最快", "中文與英文表現均衡", "外掛與 API 生態成熟"],
    cons: ["進階模型需付費", "即時資訊需搭配搜尋或外掛"],
    verdict: "最適合一般使用者入門與日常生產力。",
  },
  gemini: {
    sourceSummary:
      "Google Gemini 官網主打多模態理解、與 Google 搜尋及 Workspace 整合，強調研究與資訊整理。",
    pros: ["搜尋與研究場景強", "與 Google 帳號整合", "多模態輸入支援"],
    cons: ["部分進階功能因地區而異", "介面與功能更新較頻繁"],
    verdict: "適合需要查資料、整理資訊與 Google 工作流的使用者。",
  },
  claude: {
    sourceSummary:
      "Anthropic Claude 官網強調安全、長上下文與細緻推理，Pro 方案提供更高用量與進階模型。",
    pros: ["長文與程式分析佳", "回答結構清楚", "文件與程式碼場景表現穩定"],
    cons: ["部分地區存取限制", "影像等進階能力依方案而異"],
    verdict: "適合深度閱讀、分析與專業寫作／開發輔助。",
  },
};
