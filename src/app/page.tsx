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
  FileText,
  Settings,
  Bell,
  User,
  LayoutDashboard,
  FolderOpen,
  Calculator,
  Sparkles,
  ArrowRight,
  Copy,
  RotateCcw,
} from "lucide-react";
import { RentSurveyRequest, RentSurveyResult } from "@/types";

const layouts = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3DK", "3LDK", "4LDK"];
const structures = ["RC", "SRC", "鉄骨", "木造"];

const confidenceConfig = {
  high: { label: "高", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  medium: { label: "中", color: "text-amber-700 bg-amber-50 border-amber-200", icon: Info },
  low: { label: "低", color: "text-red-700 bg-red-50 border-red-200", icon: AlertTriangle },
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "ダッシュボード", active: false },
  { icon: FolderOpen, label: "案件管理", active: false },
  { icon: Calculator, label: "事業収支", active: true },
  { icon: FileText, label: "帳票出力", active: false },
  { icon: BarChart3, label: "分析", active: false },
  { icon: Settings, label: "設定", active: false },
];

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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (adjustedRent) {
      navigator.clipboard.writeText(adjustedRent.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* ===== PC Top Bar ===== */}
      <header className="bg-[#1a1f36] text-white h-12 flex items-center px-4 lg:px-6 z-30 flex-shrink-0">
        <div className="flex items-center gap-2.5 mr-8">
          <div className="w-7 h-7 bg-blue-500 rounded flex items-center justify-center">
            <Building2 size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-wide hidden sm:inline">LAND</span>
        </div>

        {/* Breadcrumb - PC */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400">
          <span>事業収支</span>
          <ArrowRight size={10} />
          <span>収支計画表 新規作成</span>
          <ArrowRight size={10} />
          <span className="text-white font-medium">AI賃料調査</span>
        </div>

        {/* Mobile title */}
        <span className="text-xs font-medium lg:hidden">AI賃料調査</span>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 hidden sm:inline">
            PoC v1.0
          </span>
          <button className="p-1.5 hover:bg-white/10 rounded hidden sm:block">
            <Bell size={15} className="text-gray-400" />
          </button>
          <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
            <User size={13} className="text-gray-300" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ===== PC Sidebar ===== */}
        <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={15} className={item.active ? "text-blue-600" : "text-gray-400"} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="px-3 py-3 border-t border-gray-100 text-[10px] text-gray-400">
            LAND v3.2.1
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <main className="flex-1 overflow-y-auto">
          {/* Page header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                <h1 className="text-sm font-bold text-gray-900">AI賃料調査</h1>
                <span className="hidden sm:inline text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  事業収支 &gt; 賃料目線
                </span>
              </div>
              <p className="text-[10px] text-gray-400 hidden md:block">
                AIが検索エンジン経由で周辺相場を自動分析します
              </p>
            </div>
          </div>

          {/* Content area */}
          <div className="p-4 lg:p-6">
            <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">

              {/* ===== Left Panel: Input ===== */}
              <div className="xl:w-[380px] flex-shrink-0">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* Form header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Search size={14} className="text-blue-600" />
                    <h2 className="text-xs font-semibold text-gray-800">物件条件</h2>
                  </div>

                  <div className="p-4 space-y-3.5">
                    {/* Area */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <MapPin size={11} /> エリア <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        placeholder="港区 六本木、渋谷区 恵比寿駅..."
                        className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50 focus:bg-white transition-colors"
                        required
                      />
                    </div>

                    {/* Layout */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Home size={11} /> 間取り <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-5 gap-1">
                        {layouts.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setForm({ ...form, layout: l })}
                            className={`py-1.5 rounded text-[11px] font-medium border transition-all ${
                              form.layout === l
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Structure */}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                        <Building2 size={11} /> 構造
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {structures.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, structure: form.structure === s ? undefined : s })}
                            className={`py-1.5 rounded text-[11px] font-medium border transition-all ${
                              form.structure === s
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Age & Walk */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Calendar size={11} /> 築年数
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={form.age_years ?? ""}
                            onChange={(e) => setForm({ ...form, age_years: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="10"
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">年</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <Footprints size={11} /> 駅徒歩
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={form.walk_minutes ?? ""}
                            onChange={(e) => setForm({ ...form, walk_minutes: e.target.value ? Number(e.target.value) : undefined })}
                            placeholder="7"
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">分</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="px-4 pb-4">
                    <button
                      type="submit"
                      disabled={loading || !form.area.trim()}
                      className="w-full py-2.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          AI調査中...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          賃料相場を調査
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick info */}
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-[10px] text-blue-700 leading-relaxed">
                  <strong>AI検索方式</strong>：SUUMO・アットホーム等から周辺相場を自動収集・分析。スクレイピングは行いません。結果は参考価格です。
                </div>
              </div>

              {/* ===== Right Panel: Results ===== */}
              <div className="flex-1 min-w-0">
                {/* Loading */}
                {loading && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 lg:p-12">
                    <div className="text-center max-w-sm mx-auto">
                      <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-800 mb-4">AI調査を実行中</p>
                      <div className="space-y-2.5">
                        {[
                          "検索エンジンで周辺物件を収集中...",
                          "複数ソースのデータをクロスチェック中...",
                          "相場レンジを分析・算出中...",
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-bar flex-shrink-0"
                              style={{ animationDelay: `${i * 0.4}s` }}
                            />
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{error}</p>
                      <p className="text-xs text-red-600 mt-1">手動で賃料目線を入力してください。</p>
                    </div>
                  </div>
                )}

                {/* Empty */}
                {!loading && !result && !error && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 lg:p-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 size={28} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">調査結果がここに表示されます</p>
                    <p className="text-xs text-gray-400">
                      左の条件パネルからエリア・間取りを入力して調査を実行してください
                    </p>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div className="space-y-4">
                    {/* Main result */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                      {/* Header */}
                      <div className="px-4 lg:px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                          <TrendingUp size={14} className="text-blue-600" />
                          調査結果
                        </h2>
                        {(() => {
                          const conf = confidenceConfig[result.confidence];
                          const Icon = conf.icon;
                          return (
                            <span className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 font-medium ${conf.color}`}>
                              <Icon size={10} />
                              信頼度: {conf.label}
                            </span>
                          );
                        })()}
                      </div>

                      <div className="p-4 lg:p-5">
                        {/* KPI row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                          {/* Estimated */}
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:col-span-1">
                            <p className="text-[10px] text-blue-600 font-medium mb-1">推定賃料単価</p>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl lg:text-3xl font-bold text-blue-700">
                                {result.estimated_rent_per_sqm.toLocaleString()}
                              </span>
                              <span className="text-xs text-blue-500 mb-0.5">円/㎡</span>
                            </div>
                          </div>
                          {/* Min */}
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-1">
                            <p className="text-[10px] text-gray-500 font-medium">最低</p>
                            <p className="text-lg font-bold text-gray-700">
                              {result.rent_range.min.toLocaleString()}
                              <span className="text-[10px] font-normal text-gray-400 ml-0.5">円/㎡</span>
                            </p>
                          </div>
                          {/* Max */}
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-1">
                            <p className="text-[10px] text-gray-500 font-medium">最高</p>
                            <p className="text-lg font-bold text-gray-700">
                              {result.rent_range.max.toLocaleString()}
                              <span className="text-[10px] font-normal text-gray-400 ml-0.5">円/㎡</span>
                            </p>
                          </div>
                        </div>

                        {/* Range bar */}
                        <div className="mb-5">
                          <p className="text-[10px] text-gray-500 font-medium mb-1.5">相場レンジ</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-12 text-right">{result.rent_range.min.toLocaleString()}</span>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full relative overflow-hidden">
                              <div className="absolute h-full bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 rounded-full" style={{ left: "8%", right: "8%" }} />
                              <div
                                className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md -top-[1px]"
                                style={{
                                  left: `${((result.rent_range.median - result.rent_range.min) / (result.rent_range.max - result.rent_range.min)) * 84 + 8}%`,
                                  transform: "translateX(-50%)",
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500 w-12">{result.rent_range.max.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Adjustable rent - the key output */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                              <Calculator size={13} />
                              賃料目線（収支計画に反映）
                            </label>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={handleCopy}
                                className="text-[10px] px-2 py-1 border border-amber-300 rounded text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1"
                              >
                                {copied ? <CheckCircle2 size={10} /> : <Copy size={10} />}
                                {copied ? "コピー済" : "コピー"}
                              </button>
                              <button
                                onClick={() => setAdjustedRent(result.estimated_rent_per_sqm)}
                                className="text-[10px] px-2 py-1 border border-amber-300 rounded text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1"
                              >
                                <RotateCcw size={10} />
                                リセット
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={adjustedRent ?? ""}
                              onChange={(e) => setAdjustedRent(Number(e.target.value))}
                              className="flex-1 px-3 py-2 border border-amber-300 rounded text-lg font-bold text-amber-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
                            />
                            <span className="text-xs text-amber-700 font-medium">円/㎡</span>
                          </div>
                          <p className="text-[10px] text-amber-600 mt-1.5">
                            AI調査結果をセット済み。手動で調整して収支計算に反映できます。
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Analysis summary */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="px-4 lg:px-5 py-3 border-b border-gray-100">
                        <h3 className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                          <Info size={14} className="text-blue-600" />
                          分析概要
                        </h3>
                      </div>
                      <div className="p-4 lg:p-5">
                        <p className="text-xs text-gray-700 leading-relaxed">{result.analysis_summary}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400">
                          <span>情報源: {result.sources.join("・")}</span>
                          <span>調査日時: {new Date(result.surveyed_at).toLocaleString("ja-JP")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sample properties */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setShowSamples(!showSamples)}
                        className="w-full px-4 lg:px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                          <ExternalLink size={14} className="text-blue-600" />
                          参照物件データ ({result.sample_properties.length}件)
                        </span>
                        {showSamples ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </button>

                      {showSamples && (
                        <div className="border-t border-gray-100">
                          {/* Desktop table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-[11px]">
                              <thead>
                                <tr className="text-gray-400 border-b border-gray-100 bg-gray-50/80">
                                  <th className="text-left px-4 py-2 font-medium">物件名</th>
                                  <th className="text-right px-3 py-2 font-medium">賃料</th>
                                  <th className="text-right px-3 py-2 font-medium">面積</th>
                                  <th className="text-right px-3 py-2 font-medium">単価</th>
                                  <th className="text-right px-3 py-2 font-medium">築年</th>
                                  <th className="text-right px-3 py-2 font-medium">徒歩</th>
                                  <th className="text-left px-3 py-2 font-medium">出典</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.sample_properties.map((prop, i) => (
                                  <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                                    <td className="px-4 py-2 text-gray-800 font-medium">{prop.name}</td>
                                    <td className="px-3 py-2 text-right text-gray-600">{prop.rent.toLocaleString()}円</td>
                                    <td className="px-3 py-2 text-right text-gray-500">{prop.area_sqm}㎡</td>
                                    <td className="px-3 py-2 text-right text-blue-700 font-semibold">{prop.rent_per_sqm.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-gray-500">{prop.age_years}年</td>
                                    <td className="px-3 py-2 text-right text-gray-500">{prop.walk_minutes}分</td>
                                    <td className="px-3 py-2">
                                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{prop.source}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile cards */}
                          <div className="md:hidden divide-y divide-gray-100">
                            {result.sample_properties.map((prop, i) => (
                              <div key={i} className="px-4 py-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <p className="text-xs font-medium text-gray-800 truncate flex-1 mr-2">{prop.name}</p>
                                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded flex-shrink-0">{prop.source}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-[10px]">
                                  <div>
                                    <p className="text-gray-400">賃料</p>
                                    <p className="text-gray-700 font-medium">{prop.rent.toLocaleString()}円</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">単価</p>
                                    <p className="text-blue-700 font-semibold">{prop.rent_per_sqm.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">面積</p>
                                    <p className="text-gray-600">{prop.area_sqm}㎡</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400">築年/徒歩</p>
                                    <p className="text-gray-600">{prop.age_years}年/{prop.walk_minutes}分</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
