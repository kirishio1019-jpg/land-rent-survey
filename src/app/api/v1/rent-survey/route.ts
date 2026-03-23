import { NextRequest, NextResponse } from "next/server";
import { RentSurveyRequest, RentSurveyResult, SampleProperty } from "@/types";

// Mock data: area-based rent estimates (per sqm, monthly)
const areaRentData: Record<string, { base: number; variance: number }> = {
  "港区": { base: 5200, variance: 800 },
  "六本木": { base: 5500, variance: 900 },
  "渋谷区": { base: 4800, variance: 700 },
  "新宿区": { base: 4200, variance: 600 },
  "千代田区": { base: 5000, variance: 750 },
  "中央区": { base: 4600, variance: 650 },
  "目黒区": { base: 4000, variance: 500 },
  "世田谷区": { base: 3500, variance: 450 },
  "品川区": { base: 3800, variance: 500 },
  "豊島区": { base: 3600, variance: 400 },
  "文京区": { base: 3900, variance: 450 },
  "台東区": { base: 3400, variance: 400 },
  "江東区": { base: 3200, variance: 350 },
  "大田区": { base: 3100, variance: 350 },
  "杉並区": { base: 3300, variance: 400 },
  "中野区": { base: 3400, variance: 400 },
  "練馬区": { base: 2800, variance: 300 },
  "板橋区": { base: 2700, variance: 300 },
  "足立区": { base: 2400, variance: 250 },
  "横浜市": { base: 2800, variance: 400 },
  "川崎市": { base: 3000, variance: 400 },
  "大阪市": { base: 2600, variance: 350 },
  "名古屋市": { base: 2200, variance: 300 },
  "福岡市": { base: 2400, variance: 300 },
  "札幌市": { base: 1800, variance: 250 },
};

const layoutMultiplier: Record<string, number> = {
  "1R": 0.85,
  "1K": 0.9,
  "1DK": 0.95,
  "1LDK": 1.0,
  "2K": 0.95,
  "2DK": 1.0,
  "2LDK": 1.05,
  "3LDK": 1.1,
  "3DK": 1.05,
  "4LDK": 1.15,
};

const structureMultiplier: Record<string, number> = {
  "RC": 1.1,
  "SRC": 1.15,
  "鉄骨": 1.0,
  "木造": 0.85,
};

function findAreaData(area: string): { base: number; variance: number } {
  for (const [key, data] of Object.entries(areaRentData)) {
    if (area.includes(key)) return data;
  }
  return { base: 3000, variance: 400 };
}

function generateSampleProperties(
  area: string,
  layout: string,
  baseRent: number,
  ageYears: number,
  walkMin: number
): SampleProperty[] {
  const sources = ["SUUMO", "アットホーム", "ライフルホームズ"];
  const samples: SampleProperty[] = [];
  const sqmByLayout: Record<string, number> = {
    "1R": 20, "1K": 25, "1DK": 30, "1LDK": 40,
    "2K": 35, "2DK": 45, "2LDK": 55, "3DK": 60, "3LDK": 70, "4LDK": 85,
  };
  const baseSqm = sqmByLayout[layout] || 40;

  for (let i = 0; i < 6; i++) {
    const variation = 0.8 + Math.random() * 0.4;
    const sqm = baseSqm + Math.floor((Math.random() - 0.5) * 10);
    const rentPerSqm = Math.round(baseRent * variation);
    const rent = rentPerSqm * sqm;
    const age = Math.max(0, ageYears + Math.floor((Math.random() - 0.5) * 10));
    const walk = Math.max(1, walkMin + Math.floor((Math.random() - 0.5) * 6));

    samples.push({
      name: `${area}周辺 ${layout}マンション ${String.fromCharCode(65 + i)}`,
      rent,
      area_sqm: sqm,
      rent_per_sqm: rentPerSqm,
      layout,
      age_years: age,
      walk_minutes: walk,
      source: sources[i % sources.length],
    });
  }

  return samples.sort((a, b) => a.rent_per_sqm - b.rent_per_sqm);
}

export async function POST(request: NextRequest) {
  try {
    const body: RentSurveyRequest = await request.json();

    if (!body.area || !body.layout) {
      return NextResponse.json(
        { status: "error", error: "エリアと間取りは必須です" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500));

    const areaData = findAreaData(body.area);
    let baseRent = areaData.base;

    // Apply layout multiplier
    const layoutMult = layoutMultiplier[body.layout] || 1.0;
    baseRent *= layoutMult;

    // Apply structure multiplier
    if (body.structure) {
      const structMult = structureMultiplier[body.structure] || 1.0;
      baseRent *= structMult;
    }

    // Apply age discount
    if (body.age_years) {
      const ageDiscount = Math.max(0.7, 1 - body.age_years * 0.01);
      baseRent *= ageDiscount;
    }

    // Apply walk distance discount
    if (body.walk_minutes && body.walk_minutes > 5) {
      const walkDiscount = Math.max(0.85, 1 - (body.walk_minutes - 5) * 0.01);
      baseRent *= walkDiscount;
    }

    baseRent = Math.round(baseRent);
    const variance = areaData.variance;
    const min = Math.round(baseRent - variance);
    const max = Math.round(baseRent + variance);

    const sampleProperties = generateSampleProperties(
      body.area,
      body.layout,
      baseRent,
      body.age_years || 10,
      body.walk_minutes || 7
    );

    const sources = ["SUUMO", "アットホーム", "ライフルホームズ"];
    const sampleCount = sampleProperties.length;

    const confidence: "high" | "medium" | "low" =
      sampleCount >= 5 ? "high" : sampleCount >= 3 ? "medium" : "low";

    const structureLabel = body.structure || "指定なし";
    const ageLabel = body.age_years ? `築${body.age_years}年` : "築年数指定なし";
    const walkLabel = body.walk_minutes ? `徒歩${body.walk_minutes}分以内` : "徒歩分数指定なし";

    const result: RentSurveyResult = {
      estimated_rent_per_sqm: baseRent,
      rent_range: { min, median: baseRent, max },
      confidence,
      sources,
      surveyed_at: new Date().toISOString(),
      analysis_summary:
        `${body.area}エリアの${body.layout}（${structureLabel}・${ageLabel}・${walkLabel}）について、` +
        `${sources.join("・")}から${sampleCount}件の類似物件データを収集・分析しました。` +
        `推定賃料単価は${baseRent.toLocaleString()}円/㎡（月額）、` +
        `相場レンジは${min.toLocaleString()}〜${max.toLocaleString()}円/㎡です。` +
        (confidence === "high"
          ? "十分なサンプル数が確保されており、信頼度は高いと判断します。"
          : "サンプル数が限定的なため、参考値としてご利用ください。"),
      sample_properties: sampleProperties,
    };

    return NextResponse.json({ status: "success", data: result });
  } catch {
    return NextResponse.json(
      { status: "error", error: "調査に失敗しました。手動で入力してください。" },
      { status: 500 }
    );
  }
}
