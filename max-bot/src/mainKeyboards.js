import { Keyboard } from '@maxhub/max-bot-api';

export class MainKeyboards {
  static getMainMenu() {
    return Keyboard.inlineKeyboard([
      [
        Keyboard.button.callback('💬 Чат с ботом', 'start_chat'),
        Keyboard.button.callback('ℹ️ О боте', 'show_info'),
      ],
      [
        Keyboard.button.callback('⚙️ Настройки', 'show_settings'),
        Keyboard.button.callback('🛠️ Админка', 'show_admin'),
      ]
    ]);
  }

  static getChatKeyboard() {
    return Keyboard.inlineKeyboard([
      [
        Keyboard.button.callback('🔍 Поиск новостей', 'search_news'),
        Keyboard.button.callback('📰 Тренды', 'show_trends'),
      ],
      [
        Keyboard.button.callback('💡 Примеры запросов', 'show_examples'),
        Keyboard.button.callback('◀️ Главное меню', 'back_to_main'),
      ]
    ]);
  }

  static getSettingsKeyboard() {
    return Keyboard.inlineKeyboard([
      [
        Keyboard.button.callback('🔔 Уведомления', 'toggle_notifications'),
        Keyboard.button.callback('🌙 Тема', 'change_theme'),
      ],
      [
        Keyboard.button.callback('📊 Статистика', 'show_stats'),
        Keyboard.button.callback('◀️ Назад', 'back_to_main'),
      ]
    ]);
  }

  static getAdminKeyboard() {
    return Keyboard.inlineKeyboard([
      [
        Keyboard.button.callback('📊 Статистика', 'admin_stats'),
        Keyboard.button.callback('📢 Рассылка', 'admin_broadcast'),
      ],
      [
        Keyboard.button.callback('🔧 Управление', 'admin_manage'),
        Keyboard.button.callback('◀️ Главное меню', 'back_to_main'),
      ]
    ]);
  }
}