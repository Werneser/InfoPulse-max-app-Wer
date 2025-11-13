import { Bot } from '@maxhub/max-bot-api';
import { BOT_CONFIG } from './src/config.js';
import { CommandHandlers } from './src/commandHandlers.js';
import { CallbackHandlers } from './src/callbackHandlers.js';
import { adminMiddleware } from './src/adminMiddleware.js';
import { MainKeyboards } from './src/mainKeyboards.js';
import { NewsService } from './src/services/newsService.js';

console.log('🔧 Инициализация бота...');

// Создаем экземпляр бота
const bot = new Bot(BOT_CONFIG.BOT_TOKEN);

// Подключаем middleware
bot.use(adminMiddleware);

// Логируем все входящие события
bot.use(async (ctx, next) => {
  console.log('📨 Входящее событие:', {
    type: ctx.update?.type,
    chatId: ctx.chat?.chat_id,
    userId: ctx.user?.user_id,
    text: ctx.message?.body?.text
  });
  return next();
});

// Устанавливаем команды бота
bot.api.setMyCommands([
  { name: 'start', description: 'Запустить бота' },
  { name: 'help', description: 'Помощь и справка' },
  { name: 'chat', description: 'Чат с AI-помощником' },
  { name: 'tech', description: 'Новости технологий' },
  { name: 'sports', description: 'Спортивные новости' },
  { name: 'politics', description: 'Политические новости' },
  { name: 'myid', description: 'Показать мой ID' },
  { name: 'settings', description: 'Настройки бота' },
  { name: 'admin', description: 'Админ-панель' },
]).then(() => {
  console.log('✅ Команды бота установлены');
}).catch(error => {
  console.error('❌ Ошибка установки команд:', error);
});

// Обработчики команд
bot.command('start', (ctx) => {
  console.log('🔄 Обработка команды /start от пользователя:', ctx.user?.user_id);
  return CommandHandlers.start(ctx);
});

bot.command('config', (ctx) => {
  return CommandHandlers.config(ctx);
});

bot.command('help', (ctx) => {
  console.log('🔄 Обработка команды /help');
  return CommandHandlers.help(ctx);
});

bot.command('myid', (ctx) => {
  const userId = ctx.user?.user_id;
  const chatId = ctx.chat?.chat_id;
  
  const idText = `👤 *Ваши идентификаторы:*

*User ID:* \`${userId}\`
*Chat ID:* \`${chatId}\`
*Username:* ${ctx.user?.username || 'не установлен'}

💡 *User ID* - ваш уникальный идентификатор в MAX
💡 *Chat ID* - идентификатор этого чата`;

  ctx.reply(idText, { format: 'markdown' });
});

bot.command('chat', (ctx) => {
  console.log('🔄 Обработка команды /chat');
  return CommandHandlers.chat(ctx);
});

bot.command('settings', (ctx) => {
  console.log('🔄 Обработка команды /settings');
  return CommandHandlers.settings(ctx);
});

bot.command('admin', (ctx) => {
  console.log('🔄 Обработка команды /admin');
  return CommandHandlers.admin(ctx);
});

// Команды для быстрого поиска новостей
bot.command('tech', async (ctx) => {
  console.log('🔄 Обработка команды /tech');
  await ctx.reply('🔍 Ищу новости о технологиях...');
  try {
    const articles = await NewsService.searchNews('технологии IT гаджеты', 5);
    const response = NewsService.formatNewsResponse(articles, 'технологии');
    await ctx.reply(response, { format: 'markdown' });
  } catch (error) {
    await ctx.reply('❌ Не удалось найти новости о технологиях.');
  }
});

bot.command('sports', async (ctx) => {
  console.log('🔄 Обработка команды /sports');
  await ctx.reply('🔍 Ищу спортивные новости...');
  try {
    const articles = await NewsService.searchNews('спорт футбол хоккей', 5);
    const response = NewsService.formatNewsResponse(articles, 'спорт');
    await ctx.reply(response, { format: 'markdown' });
  } catch (error) {
    await ctx.reply('❌ Не удалось найти спортивные новости.');
  }
});

bot.command('politics', async (ctx) => {
  console.log('🔄 Обработка команды /politics');
  await ctx.reply('🔍 Ищу политические новости...');
  try {
    const articles = await NewsService.searchNews('политика правительство', 5);
    const response = NewsService.formatNewsResponse(articles, 'политика');
    await ctx.reply(response, { format: 'markdown' });
  } catch (error) {
    await ctx.reply('❌ Не удалось найти политические новости.');
  }
});

// Основные callback-обработчики
const callbackActions = {
  'start_chat': CallbackHandlers.startChat,
  'show_info': CallbackHandlers.showInfo,
  'show_settings': CallbackHandlers.showSettings,
  'show_admin': CallbackHandlers.showAdmin,
  'back_to_main': CallbackHandlers.backToMain,
  
  // Обработчики чата
  'search_news': CallbackHandlers.searchNews,
  'show_trends': CallbackHandlers.showTrends,
  'show_examples': CallbackHandlers.showExamples,
  
  // Обработчики настроек
  'toggle_notifications': CallbackHandlers.toggleNotifications,
  'change_theme': CallbackHandlers.changeTheme,
  'show_stats': CallbackHandlers.showStats,
  
  // Обработчики админки
  'admin_stats': CallbackHandlers.adminStats,
  'admin_broadcast': CallbackHandlers.adminBroadcast,
  'admin_manage': CallbackHandlers.adminManage
};

// Регистрируем все обработчики
Object.entries(callbackActions).forEach(([action, handler]) => {
  bot.action(action, (ctx) => {
    console.log(`🔄 Обработка callback: ${action} от пользователя:`, ctx.user?.user_id);
    return handler(ctx);
  });
});

// Обработчик текстовых сообщений
bot.on('message_created', async (ctx) => {
  const message = ctx.message;
  
  // Пропускаем команды
  if (message.body.text && message.body.text.startsWith('/')) {
    return;
  }
  
  console.log('💬 Текстовое сообщение:', {
    text: message.body.text,
    messageId: message.body.mid,
    chatId: ctx.chat?.chat_id,
    userId: ctx.user?.user_id
  });
  
  if (message.body.text && !message.body.text.startsWith('/')) {
    const userMessage = message.body.text.trim();
    
    // Показываем, что бот ищет новости
    await ctx.reply(`🔍 Ищу новости по запросу: "${userMessage}"...`);
    
    try {
      console.log(`🎯 Начинаем поиск новостей для: "${userMessage}"`);
      
      // Ищем новости через NewsAPI
      const articles = await NewsService.searchNews(userMessage, 5);
      console.log(`📊 Получено статей: ${articles ? articles.length : 0}`);
      
      if (articles && articles.length > 0) {
        // Форматируем ответ с новостями
        const newsResponse = NewsService.formatNewsResponse(articles, userMessage);
        console.log(`📨 Отправляем ответ с ${articles.length} новостями`);
        
        await ctx.reply(newsResponse, { 
          format: 'markdown',
          attachments: [MainKeyboards.getChatKeyboard()]
        });
      } else {
        console.log('❌ Новости не найдены');
        await ctx.reply(`❌ По запросу "${userMessage}" новостей не найдено.\n\n💡 Попробуйте:\n• Другие ключевые слова\n• Более общий запрос\n• Английские термины`, {
          attachments: [MainKeyboards.getChatKeyboard()]
        });
      }
      
    } catch (error) {
      console.error('❌ Ошибка при обработке запроса:', error);
      await ctx.reply(`❌ Произошла ошибка при поиске новостей.\n\nСообщение: ${error.message}\n\nПопробуйте позже или используйте другой запрос.`, {
        attachments: [MainKeyboards.getChatKeyboard()]
      });
    }
  }
});

// Обработчик начала диалога с ботом
bot.on('bot_started', async (ctx) => {
  console.log('🆕 Новый пользователь начал диалог с ботом:', ctx.user?.user_id);
  await CommandHandlers.start(ctx);
});

// Обработчик ошибок
bot.catch((error) => {
  console.error('❌ Критическая ошибка бота:', error);
});

// Запуск бота
console.log('🚀 Запуск InfoPulse MAX Bot...');
console.log('⏳ Подключение к серверам MAX...');

bot.start().then(() => {
  console.log('✅ Бот успешно подключен к серверам MAX!');
  console.log('📱 Бот готов к приему сообщений');
  console.log('🔧 Доступные команды:');
  console.log('   /start - Главное меню');
  console.log('   /help - Помощь');
  console.log('   /chat - AI-чат');
  console.log('   /tech - Новости технологий');
  console.log('   /sports - Спортивные новости');
  console.log('   /politics - Политические новости');
  console.log('   /myid - Показать мой ID');
  console.log('   /settings - Настройки');
  console.log('   /admin - Админ-панель');
}).catch((error) => {
  console.error('❌ Ошибка при подключении бота:', error);
  process.exit(1);
});

// Обработка graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка бота...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Остановка бота...');
  process.exit(0);
});