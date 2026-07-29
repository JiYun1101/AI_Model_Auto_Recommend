/**
 * InputPreprocessor: 입력 전처리 단계.
 * Phase 1에서는 원본 입력을 변경하지 않고 그대로 반환.
 * Phase 2에서 민감정보 마스킹, 정규화 등을 이 레이어에 추가.
 */
export function preprocessInput(prompt: string): string {
  return prompt;
}
