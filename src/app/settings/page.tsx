"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTarotStore } from "@/store/useTarotStore";
import { LLMSettings } from "@/types";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";

const models: Record<string, string[]> = {
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-4.1"],
  anthropic: ["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-7"],
  deepseek: ["deepseek-v4-pro", "deepseek-v4-flash"],
};

export default function SettingsPage() {
  const router = useRouter();
  const { llmSettings, setLLMSettings, loadLLMSettings } = useTarotStore();

  const [provider, setProvider] = useState<LLMSettings["provider"]>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadLLMSettings();
  }, []);

  useEffect(() => {
    if (llmSettings) {
      setProvider(llmSettings.provider);
      setApiKey(llmSettings.apiKey);
      setModel(llmSettings.model);
    } else {
      setModel(models.openai[0]);
    }
  }, [llmSettings]);

  const handleSave = () => {
    const settings: LLMSettings = {
      provider,
      apiKey: apiKey.trim(),
      model: model || models[provider][0],
    };
    setLLMSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <h1 className="text-2xl font-bold text-purple-100 mb-8">设置</h1>

        <div className="space-y-6">
          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              LLM 提供商
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["openai", "anthropic", "deepseek"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    setModel(models[p][0]);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    provider === p
                      ? "border-purple-500/50 bg-purple-950/30 text-purple-200"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    {p === "openai" ? "OpenAI" : p === "anthropic" ? "Anthropic" : "DeepSeek"}
                  </div>
                  <div className="text-xs mt-1 text-zinc-500">
                    {p === "openai" ? "GPT 系列" : p === "anthropic" ? "Claude 系列" : "V4 系列"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === "openai" ? "sk-..." : provider === "anthropic" ? "sk-ant-..." : "sk-..."
                }
                className="w-full px-4 py-3 pr-10 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-600/50 transition-colors text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              模型
            </label>
            <div className="space-y-2">
              {models[provider].map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`w-full p-3 rounded-xl border text-left text-sm transition-all duration-200 ${
                    model === m
                      ? "border-purple-500/50 bg-purple-950/30 text-purple-200"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              saved
                ? "bg-green-800/40 text-green-300 border border-green-700/30"
                : "bg-gradient-to-r from-purple-700 to-purple-600 text-white hover:from-purple-600 hover:to-purple-500 shadow-lg shadow-purple-900/30"
            }`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                已保存
              </>
            ) : (
              "保存设置"
            )}
          </motion.button>
        </div>

        <p className="text-xs text-zinc-600 mt-6 text-center">
          API Key 仅保存在浏览器本地存储中，不会上传到任何服务器
        </p>
      </div>
    </div>
  );
}
