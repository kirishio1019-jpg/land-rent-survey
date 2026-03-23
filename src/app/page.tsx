"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  Building2,
  Calendar,
  Footprints,
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { RentSurveyRequest, RentSurveyResult } from "@/types";

const layouts = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3DK", "3LDK", "4LDK"];
const structures = ["RC", "SRC", "鉄骨", "木造"];

const confidenceConfig = {
  high: { label: "高", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
  medium: { label: "中", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Info },
  low: { label: "低", color: "text-red-600 bg-red-50 border-red-200", icon: AlertTriangle },
};

export default function RentSurveyPage() {
  const [form, setForm] = useState<RentSurveyRequest>({
    area: "",
    layout: "1LDK",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RentSurveyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adjustedRent, setAdjustedRent] = useState<number | null>(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.area.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setAdjustedRent(null);
    setShowSamples(false);

    try {
      const res = await fetch("/api/v1/rent-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.status === "success" && json.data) {
        setResult(json.data);
        setAdjustedRent(json.data.estimated_rent_per_sqm);
      } else {
        setError(json.error || "調査に失敗しました");
      }
    } catch {
      setError("調査に失敗しました。手動で入力してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-14 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">AI賃料調査</h1>
            <p className="text-[10px] text-gray-500">LAND 事業収支作成機能</p>
          </div>
          <span className="ml-2 text-[10px] px-2 py-0.5 bg-blue-50 text-primary rounded-full border border-blue-200">
            PoC v1.0
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          {/* Left: Input Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search size={16} className="text-primary" />
                物件条件入力
              </h2>

              {/* Area */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} /> エリア（住所・最寄り駅）
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="例: 港区 六本木、渋谷区 恵比寿駅"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              {/* Layout */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <Home size={12} /> 間取り
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {layouts.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setForm({ ...form, layout: l })}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.layout === l
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Structure */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                  <Building2 size={12} /> 構造（任意）
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {structures.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, structure: form.structure === s ? undefined : s })
                      }
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.structure === s
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age & Walk */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Calendar size={12} /> 築年数（任意）
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={form.age_years ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        age_years: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="例: 10"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Footprints size={12} /> 駅徒歩（任意）
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={form.walk_minutes ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        walk_minutes: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="例: 7"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !form.area.trim()}
                className="w-full py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    AI調査中...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    賃料相場を調査
                  </>
                )}
              </button>
            </form>

            {/* Info box */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-800">
                <strong>AI検索方式</strong> — AIが検索エンジン経由でSUUMO・アットホーム等から
                周辺相場情報を収集・分析します。スクレイピングは行いません。
              </p>
            </div>
          </div>

          {/* Right: Results */}
          <div>
            {/* Loading state */}
            {loading && (
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700 mb-3">AI調査を実行中...</p>
                  <div className="space-y-2 text-xs text-gray-400 max-w-xs mx-auto">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-bar" />
                      検索エンジンで周辺物件情報を収集中...
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse-bar" style={{ animationDelay: "0.5s" }} />
                      複数ソースのデータをクロスチェック中...
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse-bar" style={{ animationDelay: "1s" }} />
                      相場レンジを分析中...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <p className="text-xs text-red-600 mt-1">手動で賃料目線を入力してください。</p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !result && !error && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="text-sm text-gray-500 mb-1">物件条件を入力して調査を実行してください</p>
                <p className="text-xs text-gray-400">
                  AIが複数の不動産サイトから賃料相場を自動分析します
                </p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                {/* Main result card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary" />
                      調査結果 — 参考賃料
                    </h2>
                    {(() => {
                      const conf = confidenceConfig[result.confidence];
                      const Icon = conf.icon;
                      return (
                        <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${conf.color}`}>
                          <Icon size={12} />
                          信頼度: {conf.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Estimated rent */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-4">
                    <p className="text-xs text-blue-600 mb-1">推定賃料単価（月額）</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {result.estimated_rent_per_sqm.toLocaleString()}
                      </span>
                      <span className="text-sm text-blue-600 mb-1">円/㎡</span>
                    </div>
                  </div>

                  {/* Range bar */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">相場レンジ</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {result.rent_range.min.toLocaleString()}
                      </span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full relative overflow-hidden">
                        <div
                          className="absolute h-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 rounded-full"
                          style={{
                            left: "10%",
                            right: "10%",
                          }}
                        />
                        <div
                          className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow"
                          style={{
                            left: `${((result.rent_range.median - result.rent_range.min) / (result.rent_range.max - result.rent_range.min)) * 80 + 10}%`,
                            transform: "translateX(-50%)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-16">
                        {result.rent_range.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-18">
                      <span>最低</span>
                      <span>中央値</span>
                      <span>最高</span>
                    </div>
                  </div>

                  {/* Adjustable rent */}
                  <div className="border-t border-gray-100 pt-4">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      賃料目線（調整可能）
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={adjustedRent ?? ""}
                        onChange={(e) => setAdjustedRent(Number(e.target.value))}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <span className="text-xs text-gray-500">円/㎡</span>
                      <button
                        onClick={() => setAdjustedRent(result.estimated_rent_per_sqm)}
                        className="text-xs px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                      >
                        リセット
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      参考価格として自動セットされています。必要に応じて手動で調整してください。
                    </p>
                  </div>
                </div>

                {/* Analysis summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info size={16} className="text-primary" />
                    分析概要
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.analysis_summary}</p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                    <span>
                      情報源: {result.sources.join("・")}
                    </span>
                    <span>
                      調査日時: {new Date(result.surveyed_at).toLocaleString("ja-JP")}
                    </span>
                  </div>
                </div>

                {/* Sample properties */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setShowSamples(!showSamples)}
                    className="w-full px-6 py-4 flex items-center justify-between text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink size={16} className="text-primary" />
                      参照物件データ ({result.sample_properties.length}件)
                    </span>
                    {showSamples ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>

                  {showSamples && (
                    <div className="border-t border-gray-100">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-gray-400 border-b border-gray-100 bg-gray-50">
                              <th className="text-left px-4 py-2.5 font-medium">物件名</th>
                              <th className="text-right px-4 py-2.5 font-medium">賃料</th>
                              <th className="text-right px-4 py-2.5 font-medium">面積</th>
                              <th className="text-right px-4 py-2.5 font-medium">単価</th>
                              <th className="text-right px-4 py-2.5 font-medium">築年数</th>
                              <th className="text-right px-4 py-2.5 font-medium">徒歩</th>
                              <th className="text-left px-4 py-2.5 font-medium">出典</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.sample_properties.map((prop, i) => (
                              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-4 py-2.5 text-gray-900 font-medium">{prop.name}</td>
                                <td className="px-4 py-2.5 text-right text-gray-700">
                                  {prop.rent.toLocaleString()}円
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500">{prop.area_sqm}㎡</td>
                                <td className="px-4 py-2.5 text-right text-primary font-medium">
                                  {prop.rent_per_sqm.toLocaleString()}
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500">
                                  {prop.age_years}年
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500">
                                  {prop.walk_minutes}分
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                                    {prop.source}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
