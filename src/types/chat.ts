export interface ChatRequest {
  message: string;
  uuid: string;
  project_id: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    conversation_id: string;
    tokens_used: number;
    response_time: number;
    remaining_coins: number;
    model: string;
  };
}

export interface ChatError {
  success: false;
  message: string;
  error?: string;
}
