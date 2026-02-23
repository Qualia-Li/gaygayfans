export interface Variant {
  id: string;
  label: string; // "Variant A", "Variant B", etc.
  videoUrl: string;
}

export interface Scenario {
  id: string;
  name: string;
  sourceImageUrl: string | null;
  variants: Variant[];
}

export interface VariantRating {
  variantId: string;
  stars: number; // 1-5
}

export interface RatingSubmission {
  scenarioId: string;
  visitorId: string;
  ratings: VariantRating[];
  bestVariantId: string | null;
}

export interface AggregatedVariantResult {
  variantId: string;
  label: string;
  videoUrl: string;
  originalFilename: string;
  loraConfig: string;
  avgStars: number;
  totalRatings: number;
  bestPicks: number;
}

export interface AggregatedScenarioResult {
  scenarioId: string;
  name: string;
  sourceImageUrl: string | null;
  variants: AggregatedVariantResult[];
  totalSubmissions: number;
}
