export interface BaseAppConfig {
  visible: boolean;
}

export interface PaintConfig extends BaseAppConfig {
  complexity: 'simple' | 'medium' | 'complex';
}

export interface CoinsMathConfig extends BaseAppConfig {
  lowerBound: number;
  upperBound: number;
  preventOveruse: boolean;
  displayCoinName: boolean;
  displayCoinValue: boolean;
  displayAmountWhenWrong: boolean;
  showProgressBar: boolean;
  progressPerAnswer: number;
}

export interface CoinsCountConfig extends BaseAppConfig {
  lowerBound: number;
  upperBound: number;
  hintDirectionWhenWrong: boolean;
}

export interface AnalogClockGuessConfig extends BaseAppConfig {
  granularity: 'hour' | '30-minutes' | '15-minutes' | '5-minutes' | '1-minute';
  showProgressBar: boolean;
  progressPerAnswer: number;
}

export interface AnalogClockMoveConfig extends BaseAppConfig {
  granularity: 'hour' | '30-minutes' | '15-minutes' | '5-minutes' | '1-minute';
}

export interface MessageConfig extends BaseAppConfig {
  allowPaintings: boolean;
  allowText: boolean;
  allowedRecipients: string[];
}

export const MESSAGE_DEFAULT_CONFIG: MessageConfig = {
  visible: true,
  allowPaintings: true,
  allowText: true,
  allowedRecipients: [],
};

export interface AppConfig {
  'coins-math': CoinsMathConfig;
  'coins-count': CoinsCountConfig;
  'analog-clock-guess': AnalogClockGuessConfig;
  'analog-clock-move': AnalogClockMoveConfig;
  paint: PaintConfig;
  messages: MessageConfig;
}
