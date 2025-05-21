export interface ObjectiveClassification {
  objective_id: string;
  objective_type: string;
  objective_description: string;
  confidence: number;
  scores: Record<string, number>;
  auto_accept: boolean;
}
