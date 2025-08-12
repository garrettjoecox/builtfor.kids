import type {
  AnalogClockGuessConfig,
  AnalogClockMoveConfig,
  AppConfig,
  CoinsCountConfig,
  CoinsMathConfig,
  MessageConfig,
  PaintConfig,
} from '@/types/app';

export const APPS = {
  // paint: {
  //   id: 'paint',
  //   name: 'Paint',
  //   emoji: '🎨',
  //   color: 'pink',
  // },
  'coins-math': {
    id: 'coins-math',
    name: 'Coins Math',
    emoji: '🪙',
    color: 'green',
  },
  // 'coins-count': {
  //   id: 'coins-count',
  //   name: 'Coins Count',
  //   emoji: '💰',
  //   color: 'blue',
  // },
  // 'analog-clock-guess': {
  //   id: 'analog-clock-guess',
  //   name: 'Analog Clock Guess',
  //   emoji: '🕰️',
  //   color: 'purple',
  // },
  // 'analog-clock-move': {
  //   id: 'analog-clock-move',
  //   name: 'Analog Clock Move',
  //   emoji: '⏰',
  //   color: 'orange',
  // },
  // messages: {
  //   id: 'messages',
  //   name: 'Messages',
  //   emoji: '💬',
  //   color: 'yellow',
  // },
} as const;

export const PAINT_DEFAULT_CONFIG: PaintConfig = {
  visible: true,
  complexity: 'medium',
};

export const COINS_MATH_DEFAULT_CONFIG: CoinsMathConfig = {
  visible: true,
  lowerBound: 1,
  upperBound: 10,
  preventOveruse: true,
  displayCoinName: true,
  displayCoinValue: true,
  displayAmountWhenWrong: false,
  showProgressBar: true,
  progressPerAnswer: 10,
};

export const COINS_COUNT_DEFAULT_CONFIG: CoinsCountConfig = {
  visible: true,
  lowerBound: 1,
  upperBound: 10,
  hintDirectionWhenWrong: true,
};

export const ANALOG_CLOCK_GUESS_DEFAULT_CONFIG: AnalogClockGuessConfig = {
  visible: true,
  granularity: 'hour',
};

export const ANALOG_CLOCK_MOVE_DEFAULT_CONFIG: AnalogClockMoveConfig = {
  visible: true,
  granularity: 'hour',
};

export const MESSAGE_DEFAULT_CONFIG: MessageConfig = {
  visible: true,
  allowPaintings: true,
  allowText: true,
  allowedRecipients: [],
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  'coins-math': COINS_MATH_DEFAULT_CONFIG,
  'coins-count': COINS_COUNT_DEFAULT_CONFIG,
  'analog-clock-guess': ANALOG_CLOCK_GUESS_DEFAULT_CONFIG,
  'analog-clock-move': ANALOG_CLOCK_MOVE_DEFAULT_CONFIG,
  paint: PAINT_DEFAULT_CONFIG,
  messages: MESSAGE_DEFAULT_CONFIG,
};
