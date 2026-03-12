export interface Insight {
  type: 'success' | 'warning' | 'critical' | 'info';
  title: string;
  desc: string;
}

export interface PredictionResult {
  probability: number;
  prediction: number;
  threshold: number;
  status: string;
  risk_level: string;
  analysis: any[];
  ratios: {
    current_ratio: number;
    debt_to_asset: number;
    net_margin_pct: number;
  };
  insights: Insight[];
}

export interface PublicPredictionResponse {
  company_name: string;
  symbol: string;
  features: Record<string, number>;
  prediction: PredictionResult;
}

export interface CustomPredictionResponse {
  prediction: PredictionResult;
}

export interface ModelInfo {
  model_name: string;
  threshold: number;
  features: Record<string, string>;
  top_features: string[];
}
