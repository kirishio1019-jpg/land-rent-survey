export interface RentSurveyRequest {
  area: string;
  layout: string;
  age_years?: number;
  structure?: string;
  walk_minutes?: number;
}

export interface RentSurveyResponse {
  status: "success" | "error";
  data?: RentSurveyResult;
  error?: string;
}

export interface RentSurveyResult {
  estimated_rent_per_sqm: number;
  rent_range: {
    min: number;
    median: number;
    max: number;
  };
  confidence: "high" | "medium" | "low";
  sources: string[];
  surveyed_at: string;
  analysis_summary: string;
  sample_properties: SampleProperty[];
}

export interface SampleProperty {
  name: string;
  rent: number;
  area_sqm: number;
  rent_per_sqm: number;
  layout: string;
  age_years: number;
  walk_minutes: number;
  source: string;
}
