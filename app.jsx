import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'

// База знаний чат-бота
const BOT_KNOWLEDGE = {
  greetings: {
    patterns: ['привет', 'здравствуй', 'добрый день', 'доброе утро', 'добрый вечер', 'хай', 'hello', 'hi'],
    responses: [
      "Привет! 👋 Я ваш новостной помощник. Чем могу помочь?",
      "Здравствуйте! 📰 Готов помочь найти свежие новости!",
      "Приветствую! Что вас интересует сегодня?"
    ]
  },
  how_are_you: {
    patterns: ['как дела', 'как ты', 'как настроение', 'how are you', 'what\'s up'],
    responses: [
      "У меня всё отлично! Готов искать для вас самые интересные новости! 🚀",
      "Прекрасно! Тем более, когда могу помочь с поиском новостей! 📰",
      "Всё хорошо, спасибо! Готов к работе! 💪"
    ]
  },
  who_are_you: {
    patterns: ['кто ты', 'что ты', 'расскажи о себе', 'who are you', 'what are you'],
    responses: [
      "Я - ИнфоПульс, ваш персональный новостной помощник! 🤖 Я помогаю находить свежие новости по любым темам.",
      "Я чат-бот ИнфоПульс! Моя задача - сделать чтение новостей удобным и персонализированным 📰",
      "Я ваш AI-помощник для поиска новостей. Спросите меня о чём угодно - от технологий до спорта! 🔍"
    ]
  },
  capabilities: {
    patterns: ['что ты умеешь', 'твои возможности', 'функции', 'what can you do', 'capabilities'],
    responses: [
      "Я умею: 🔍 Искать новости по любым запросам, 📂 Показывать новости по категориям, ⭐ Сохранять понравившиеся новости в избранное, 📤 Делиться ссылками на статьи!",
      "Мои возможности: Поиск актуальных новостей, Фильтрация по темам, Сохранение в избранное, Быстрый доступ к источникам! 🚀",
      "Я могу: Найти новости по вашему запросу, Показать trending темы, Сохранить интересные статьи, Поделиться ссылками! 📰"
    ]
  },
  news_sources: {
    patterns: ['откуда новости', 'источники', 'какие сайты', 'news sources', 'where from'],
    responses: [
      "Я получаю новости из тысяч источников через NewsAPI! 📡 Это ведущие мировые и российские СМИ.",
      "Новости приходят из проверенных источников: ТАСС, РИА Новости, BBC, CNN и многих других! 🌍",
      "Я использую агрегатор NewsAPI, который собирает новости из 70,000+ источников по всему миру! 📊"
    ]
  },
  help: {
    patterns: ['помощь', 'help', 'подсказка', 'как пользоваться', 'инструкция'],
    responses: [
      "Просто напишите мне, что вас интересует! Например: 'новости о технологиях' или 'свежие события в спорте' 🎯",
      "Чтобы найти новости: 1. Напишите тему 2. Выберите интересную новость 3. Нажмите 'Читать полностью'! 📖",
      "Попробуйте: 'политика', 'технологии', 'спорт' или любую другую тему! Я найду самые свежие новости! 🔥"
    ]
  },
  thanks: {
    patterns: ['спасибо', 'благодарю', 'thanks', 'thank you', 'мерси'],
    responses: [
      "Всегда рад помочь! 😊 Если нужно что-то ещё - просто спросите!",
      "Пожалуйста! Обращайтесь, если понадобятся ещё новости! 📰",
      "Рад был помочь! Возвращайтесь за свежими новостями! 🚀"
    ]
  },
  weather: {
    patterns: ['погода', 'weather', 'какая погода', 'прогноз погоды'],
    responses: [
      "К сожалению, я специализируюсь на новостях, а не на погоде! 🌤️ Но могу найти новости о климате или природных явлениях!",
      "Я новостной бот, поэтому лучше спросите у меня о последних событиях! 📰 А за погодой - к метеорологам! 😊"
    ]
  },
  time: {
    patterns: ['время', 'time', 'который час', 'сколько времени'],
    responses: [
      `Сейчас ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} ⏰ Но лучше спросите о свежих новостях!`,
      `На моих часах ${new Date().toLocaleTimeString('ru-RU')} 📱 А вы в курсе последних событий?`
    ]
  },
  joke: {
    patterns: ['шутка', 'анекдот', 'расскажи шутку', 'joke', 'make me laugh'],
    responses: [
      "Почему новости никогда не теряются? Потому что они всегда в trending! 😄",
      "Что сказал один новостной заголовок другому? 'Давай останемся на первой полосе!' 🎭",
      "Почему журналисты хорошие бегуны? Потому что они всегда за дедлайнами! 🏃‍♂️"
    ]
  },
  creator: {
    patterns: ['кто тебя создал', 'создатель', 'разработчик', 'who created you', 'developer'],
    responses: [
      "Меня создала команда ИнфоПульс чтобы сделать чтение новостей удобным и персонализированным! 💻",
      "Я был разработан для проекта ИнфоПульс - вашего персонального новостного агрегатора! 🚀"
    ]
  },
  timeline: {
    patterns: ['хронология', 'таймлайн', 'по порядку', 'история событий', 'timeline', 'chronology'],
    responses: [
      "Отличная идея! Я могу показать новости в хронологическом порядке 📅",
      "Сейчас отсортирую события по времени для лучшего понимания последовательности! ⏳"
    ]
  }
};

// Функция для анализа временных паттернов в запросе
const analyzeTimePattern = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Паттерны для определения временных периодов
  const timePatterns = {
    today: /(сегодня|today|за сегодня|за день)/,
    yesterday: /(вчера|yesterday)/,
    week: /(недел|week|за неделю|последняя неделя)/,
    month: /(месяц|month|за месяц|последний месяц)/,
    year: /(год|year|за год|последний год)/,
    last24h: /(последние 24 часа|за сутки|last 24 hours)/,
    last48h: /(последние 48 часов|за двое суток|last 48 hours)/,
    specificDate: /(\d{1,2}\.\d{1,2}\.\d{4}|\d{4}-\d{1,2}-\d{1,2})/,
    dateRange: /(с \d{1,2}\.\d{1,2} по \d{1,2}\.\d{1,2}|from.*to)/
  };

  for (const [key, pattern] of Object.entries(timePatterns)) {
    if (pattern.test(lowerMessage)) {
      return key;
    }
  }
  
  return null;
};

// Функция для вычисления дат на основе временного паттерна
const calculateDateRange = (timePattern) => {
  const now = new Date();
  const from = new Date();
  
  switch (timePattern) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      return { from: from.toISOString(), to: now.toISOString() };
    case 'yesterday':
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      return { from: from.toISOString(), to: to.toISOString() };
    case 'week':
      from.setDate(from.getDate() - 7);
      return { from: from.toISOString(), to: now.toISOString() };
    case 'month':
      from.setMonth(from.getMonth() - 1);
      return { from: from.toISOString(), to: now.toISOString() };
    case 'year':
      from.setFullYear(from.getFullYear() - 1);
      return { from: from.toISOString(), to: now.toISOString() };
    case 'last24h':
      from.setDate(from.getDate() - 1);
      return { from: from.toISOString(), to: now.toISOString() };
    case 'last48h':
      from.setDate(from.getDate() - 2);
      return { from: from.toISOString(), to: now.toISOString() };
    default:
      return null;
  }
};

// Функция для группировки новостей по временным периодам
const groupNewsByTimePeriod = (articles) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    older: []
  };

  articles.forEach(article => {
    const articleDate = new Date(article.publishedAt);
    
    if (articleDate >= today) {
      groups.today.push(article);
    } else if (articleDate >= yesterday) {
      groups.yesterday.push(article);
    } else if (articleDate >= weekAgo) {
      groups.thisWeek.push(article);
    } else if (articleDate >= monthAgo) {
      groups.thisMonth.push(article);
    } else {
      groups.older.push(article);
    }
  });

  return groups;
};

// Функция для создания временной шкалы событий
const createTimelineFromArticles = (articles, query) => {
  if (!articles || articles.length === 0) return null;

  // Сортируем статьи по дате публикации (от старых к новым для хронологии)
  const sortedArticles = [...articles].sort((a, b) => 
    new Date(a.publishedAt) - new Date(b.publishedAt)
  );

  // Группируем по дням для лучшей организации
  const articlesByDay = {};
  sortedArticles.forEach(article => {
    const date = new Date(article.publishedAt);
    const dateKey = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    if (!articlesByDay[dateKey]) {
      articlesByDay[dateKey] = [];
    }
    articlesByDay[dateKey].push(article);
  });

  return {
    query,
    totalArticles: articles.length,
    dateRange: {
      from: sortedArticles[0].publishedAt,
      to: sortedArticles[sortedArticles.length - 1].publishedAt
    },
    timeline: articlesByDay
  };
};

// Функция для поиска подходящего ответа
// Обновленная функция для поиска подходящего ответа
const findBotResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Сначала проверяем базовые команды
  for (const [category, data] of Object.entries(BOT_KNOWLEDGE)) {
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        return randomResponse;
      }
    }
  }
  
  // Проверяем, является ли запрос тематикой новостей
  const newsThemes = [
    'технологии', 'технология', 'техно', 'technology', 'tech',
    'спорт', 'спортивный', 'sports', 'sport',
    'политика', 'политический', 'politics', 'political',
    'экономика', 'экономический', 'economy', 'economic',
    'бизнес', 'business', 'финансы', 'finance',
    'наука', 'научный', 'science', 'scientific',
    'искусство', 'арт', 'art', 'культура', 'culture',
    'здоровье', 'медицина', 'health', 'medicine',
    'развлечения', 'entertainment',
    'экология', 'environment', 'природа',
    'кино', 'фильмы', 'movie', 'cinema',
    'музыка', 'music',
    'игры', 'гейминг', 'games', 'gaming'
  ];
  
  const isNewsTheme = newsThemes.some(theme => 
    lowerMessage.includes(theme) || 
    lowerMessage === theme
  );
  
  // Если это тематика новостей, не возвращаем дежурную фразу
  if (isNewsTheme) {
    return null;
  }
  
  // Для очень коротких сообщений, не связанных с новостями
  if (lowerMessage.length < 3) {
    const fallbackResponses = [
      "Пожалуйста, уточните ваш запрос! 🤔 Например: 'новости о технологиях' или 'последние события в спорте'",
      "Не совсем понял ваш вопрос. Можете сформулировать его подробнее? 📝",
      "Интересно! Можете рассказать подробнее, что вас интересует? 🔍"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
  
  return null;
};

// Компонент для отображения временной шкалы
const TimelineView = ({ timeline, onAddToFavorites, favorites, onArticleClick }) => {
  if (!timeline) return null;

  const isArticleFavorite = (article) => {
    return favorites.some(fav => fav.url === article.url);
  };

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        <h3>📅 Хронология событий: "{timeline.query}"</h3>
        <p>Найдено {timeline.totalArticles} новостей за период с {
          new Date(timeline.dateRange.from).toLocaleDateString('ru-RU')
        } по {
          new Date(timeline.dateRange.to).toLocaleDateString('ru-RU')
        }</p>
      </div>

      <div className="timeline-container">
        {Object.entries(timeline.timeline).map(([date, articles]) => (
          <div key={date} className="timeline-day">
            <div className="timeline-date">
              <div className="timeline-marker"></div>
              <h4>{date}</h4>
              <span className="articles-count">{articles.length} событий</span>
            </div>
            
            <div className="timeline-articles">
              {articles.map((article, index) => (
                <div key={index} className="timeline-article">
                  <div className="article-time">
                    {new Date(article.publishedAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  <div className="article-content">
                    <h5>{article.title}</h5>
                    <p>{article.description}</p>
                    
                    <div className="article-meta">
                      <span className="source">{article.source?.name}</span>
                      <div className="article-actions">
                        <button 
                          className="read-timeline-btn"
                          onClick={() => onArticleClick(article)}
                        >
                          📖 Читать
                        </button>
                        <button 
                          className={`favorite-btn-small ${isArticleFavorite(article) ? 'favorited' : ''}`}
                          onClick={() => onAddToFavorites(article)}
                        >
                          {isArticleFavorite(article) ? '★' : '☆'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Компонент для подтверждения перехода на внешний сайт
const ExternalLinkModal = ({ article, onClose, onConfirm }) => {
  if (!article) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content external-link-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 Переход на внешний сайт</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="external-link-content">
          <div className="warning-icon">⚠️</div>
          <h3>Вы покидаете приложение ИнфоПульс</h3>
          <p>Вы будете перенаправлены на сайт источника:</p>
          <div className="source-info">
            <strong>{article.source?.name || 'Неизвестный источник'}</strong>
          </div>
          
          <div className="article-preview">
            <h4>{article.title}</h4>
            <p>{article.description}</p>
          </div>

          <div className="external-link-actions">
            <button className="cancel-btn" onClick={onClose}>
              Отмена
            </button>
            <button 
              className="confirm-btn"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              Перейти на сайт
            </button>
          </div>

          <div className="security-notice">
            <p>🔒 Будьте внимательны при вводе личных данных на внешних сайтах</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Компонент чат-бота
const ChatBot = ({ onBack, onAddToFavorites, favorites }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('infopulse-chat-messages')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        text: "Привет! Я ваш новостной помощник ИнфоПульс! 🤖\n\nЯ умею:\n🔍 Искать свежие новости\n📅 Строить хронологию событий\n⏰ Фильтровать по времени\n⭐ Сохранять в избранное\n\nСпросите меня о чём угодно - от технологий до спорта! 🚀",
        isBot: true,
        timestamp: new Date().toISOString()
      }
    ]
  })
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [externalLinkArticle, setExternalLinkArticle] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('infopulse-chat-messages', JSON.stringify(messages))
  }, [messages])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

 const processMessage = useCallback(async (message) => {
  const botResponse = findBotResponse(message);
  
  if (botResponse) {
    const responseMessage = {
      id: Date.now() + 1,
      text: botResponse,
      isBot: true,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, responseMessage]);
    return;
  }
  
  // Если это тематический запрос, добавляем "новости" для лучшего поиска
  let searchQuery = message;
  const newsThemes = ['технологии', 'спорт', 'политика', 'экономика', 'бизнес', 'наука', 'искусство', 'здоровье', 'развлечения', 'экология'];
  
  if (newsThemes.some(theme => message.toLowerCase().includes(theme))) {
    searchQuery = `новости ${message}`;
  }
  
  await searchNews(searchQuery);
}, []);

  const searchNews = useCallback(async (query) => {
    if (!query.trim()) return
    
    setLoading(true)
    
    const userMessage = {
      id: Date.now(),
      text: query,
      isBot: false,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    
    try {
      // Анализируем временные паттерны в запросе
      const timePattern = analyzeTimePattern(query);
      const dateRange = timePattern ? calculateDateRange(timePattern) : null;
      
      let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=1621a17b15e54769853284319ee6627b`;
      
      if (dateRange) {
        apiUrl += `&from=${dateRange.from.split('T')[0]}&to=${dateRange.to.split('T')[0]}`;
      }
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (data.articles && data.articles.length > 0) {
        const filteredArticles = data.articles.filter(article => 
          article.title && article.title !== '[Removed]'
        );
        
        // Создаем временную шкалу для сложных запросов
        const shouldCreateTimeline = filteredArticles.length > 3 && 
          (query.toLowerCase().includes('хронологи') || 
           query.toLowerCase().includes('таймлайн') ||
           query.toLowerCase().includes('история событий') ||
           filteredArticles.length > 8);
        
        if (shouldCreateTimeline) {
          const timeline = createTimelineFromArticles(filteredArticles, query);
          const timelineMessage = {
            id: Date.now() + 1,
            isBot: true,
            timestamp: new Date().toISOString(),
            timeline: timeline,
            query: query
          };
          setMessages(prev => [...prev, timelineMessage]);
        } else {
          const newsMessage = {
            id: Date.now() + 1,
            isBot: true,
            timestamp: new Date().toISOString(),
            news: filteredArticles.slice(0, 10),
            query: query,
            timeFilter: timePattern
          };
          setMessages(prev => [...prev, newsMessage]);
        }
      } else {
        const noResultsMessage = {
          id: Date.now() + 1,
          text: `К сожалению, я не нашел новостей по запросу "${query}". Попробуйте другой запрос или уточните тему! 🔍\n\nНапример: "технологии", "спорт сегодня", "последние новости политики"`,
          isBot: true,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, noResultsMessage])
      }
    } catch (error) {
      console.error('Ошибка при поиске новостей:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Произошла ошибка при поиске новостей. Пожалуйста, попробуйте позже. ⚠️\n\nА пока можете спросить меня о чём-нибудь другом! 😊",
        isBot: true,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    }
    setLoading(false)
  }, [])

  const handleSendMessage = useCallback(() => {
    if (inputMessage.trim() && !loading) {
      processMessage(inputMessage.trim())
    }
  }, [inputMessage, loading, processMessage])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleQuickRequest = useCallback((query) => {
  // Для тематических запросов добавляем "новости" для лучшего поиска
  const newsThemes = ['технологии', 'спорт', 'политика', 'экономика', 'бизнес', 'наука', 'искусство', 'здоровье', 'развлечения', 'экология'];
  const searchQuery = newsThemes.includes(query.toLowerCase()) ? `новости ${query}` : query;
  processMessage(searchQuery);
}, [processMessage]);

  const handleSmartSuggestion = useCallback((suggestion) => {
    setInputMessage(suggestion)
    setTimeout(() => processMessage(suggestion), 100)
  }, [processMessage])

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }, [])

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Привет! Я ваш новостной помощник ИнфоПульс! 🤖\n\nЯ умею:\n🔍 Искать свежие новости\n📅 Строить хронологию событий\n⏰ Фильтровать по времени\n⭐ Сохранять в избранное\n\nСпросите меня о чём угодно - от технологий до спорта! 🚀",
        isBot: true,
        timestamp: new Date().toISOString()
      }
    ])
    localStorage.removeItem('infopulse-chat-messages')
  }, [])

  const isArticleFavorite = useCallback((article) => {
    return favorites.some(fav => fav.url === article.url)
  }, [favorites])

  const handleExternalLink = useCallback((article) => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }, [])

  const smartSuggestions = [
  "Что ты умеешь?",
  "Хронология событий в Непале",
  "Новости о технологиях",
  "Спортивные события",
  "Политические новости"
]

  const timeFilters = [
    { label: "Сегодня", query: "новости сегодня" },
    { label: "За неделю", query: "новости за неделю" },
    { label: "За месяц", query: "события за месяц" },
    { label: "Хронология", query: "хронология событий" }
  ]

  return (
    <>
      <div className="chat-section">
        <div className="chat-header">
          <button className="back-button" onClick={onBack}>
            ← Назад
          </button>
          <div className="chat-info">
            <div className="chat-avatar">🤖</div>
            <div>
              <h3>ИнфоПульс Бот</h3>
              <p>онлайн • AI помощник</p>
            </div>
          </div>
          <button className="clear-chat-button" onClick={clearChat}>
            🗑️ Очистить
          </button>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
            >
              {message.isBot && <div className="message-avatar">🤖</div>}
              
              <div className="message-content">
                {message.timeline ? (
                  <TimelineView
                    timeline={message.timeline}
                    onAddToFavorites={onAddToFavorites}
                    favorites={favorites}
                    onArticleClick={setExternalLinkArticle}
                  />
                ) : message.news ? (
                  <div className="news-response">
                    <div className="news-intro">
                      📰 Нашел {message.news.length} новостей по запросу "{message.query}"
                      {message.timeFilter && (
                        <span className="time-filter-badge">
                          ⏰ {getTimeFilterLabel(message.timeFilter)}
                        </span>
                      )}
                    </div>
                    {message.news.map((article, index) => (
                      <div key={index} className="news-preview">
                        {article.urlToImage && (
                          <img 
                            src={article.urlToImage} 
                            alt={article.title}
                            className="news-preview-image"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                        <div className="news-preview-content">
                          <div className="news-time-badge">
                            {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                          </div>
                          <h4>{article.title}</h4>
                          <p>{article.description || 'Описание отсутствует'}</p>
                          <div className="news-meta">
                            <span className="source">{article.source?.name || 'Неизвестный источник'}</span>
                            <span className="time">
                              {new Date(article.publishedAt).toLocaleTimeString('ru-RU')}
                            </span>
                          </div>
                          <div className="news-actions-preview">
                            <button 
                              className="read-full-btn"
                              onClick={() => setExternalLinkArticle(article)}
                            >
                              📖 Читать полностью
                            </button>
                            <button 
                              className={`favorite-btn-small ${isArticleFavorite(article) ? 'favorited' : ''}`}
                              onClick={() => onAddToFavorites(article)}
                            >
                              {isArticleFavorite(article) ? '★' : '☆'}
                            </button>
                            <button 
                              className="share-btn-small"
                              onClick={() => {
                                navigator.clipboard.writeText(article.url)
                                alert('Ссылка скопирована в буфер обмена!')
                              }}
                            >
                              📤
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="message-text">
                    {message.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {!message.isBot && <div className="message-avatar">👤</div>}
            </div>
          ))}
          
          {loading && (
            <div className="message bot-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 3 && (
          <div className="smart-suggestions">
            <p>💡 Попробуйте спросить:</p>
            <div className="suggestion-buttons">
              {smartSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSmartSuggestion(suggestion)}
                  className="suggestion-button"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 1 && (
          <div className="quick-requests">
            <p>⏰ Фильтры по времени:</p>
            <div className="quick-buttons">
              {timeFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickRequest(filter.query)}
                  className="quick-button time-filter-button"
                  disabled={loading}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <p>📰 Быстрый поиск новостей:</p>
            <div className="quick-buttons">
              {['технологии', 'спорт', 'политика', 'экономика', 'наука', 'искусство'].map((query) => (
  <button
    key={query}
    onClick={() => handleQuickRequest(`новости ${query}`)}
    className="quick-button"
    disabled={loading}
  >
    {query}
  </button>
))}
            </div>
          </div>
        )}

        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Спросите о чём угодно или найдите новости..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
            className="send-button"
          >
            📤
          </button>
        </div>
      </div>

      {externalLinkArticle && (
        <ExternalLinkModal
          article={externalLinkArticle}
          onClose={() => setExternalLinkArticle(null)}
          onConfirm={() => handleExternalLink(externalLinkArticle)}
        />
      )}
    </>
  )
}


// Вспомогательная функция для получения метки временного фильтра
const getTimeFilterLabel = (timePattern) => {
  const labels = {
    today: 'Сегодня',
    yesterday: 'Вчера',
    week: 'За неделю',
    month: 'За месяц',
    year: 'За год',
    last24h: 'За 24 часа',
    last48h: 'За 48 часов'
  };
  return labels[timePattern] || '';
};

// ... остальные компоненты (CategoriesSection, CategoryNews, FavoritesSection, SettingsSection, App) остаются без изменений
// Для краткости оставлю их как в предыдущей версии, но с добавлением временных фильтров

// Главный компонент приложения
// Главный компонент приложения
const STORAGE_KEY = 'infopulse-favorites'
const App = () => {
  const [activeSection, setActiveSection] = useState('main')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.warn('Ошибка чтения favorites из localStorage', e)
      return []
    }
  })
  // Сохраняем избранное в localStorage (с защитой)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (e) {
      console.warn('Ошибка записи favorites в localStorage', e)
    }
  }, [favorites])
  // Добавление/удаление в избранное — переключатель (toggle)
  const addToFavorites = useCallback((article) => {
    if (!article || !article.url) return
    setFavorites(prev => {
      const exists = prev.some(fav => fav.url === article.url)
      if (exists) {
        // если уже есть — удаляем (toggle)
        return prev.filter(fav => fav.url !== article.url)
      }
      // добавляем с метаданными
      return [...prev, { ...article, addedAt: new Date().toISOString() }]
    })
  }, [])
  // Явное удаление (если нужно отдельная функция)
  const removeFromFavorites = useCallback((article) => {
    if (!article || !article.url) return
    setFavorites(prev => prev.filter(fav => fav.url !== article.url))
  }, [])
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category)
    setActiveSection('category-news')
  }, [])
  const MainMenu = () => (
    <div className="main-menu">
      <h1>📰 ИнфоПульс</h1>
      <p>Ваш AI-помощник для новостей с хронологией</p>
      <div className="menu-grid">
        <div className="menu-card" role="button" tabIndex={0} onClick={() => setActiveSection('chat')}>
          <div className="menu-icon">💬</div>
          <h3>Умный чат-бот</h3>
          <p>С хронологией событий</p>
        </div>
        <div className="menu-card" role="button" tabIndex={0} onClick={() => setActiveSection('categories')}>
          <div className="menu-icon">📂</div>
          <h3>Категории</h3>
          <p>Новости по темам</p>
        </div>
        <div className="menu-card" role="button" tabIndex={0} onClick={() => setActiveSection('favorites')}>
          <div className="menu-icon">⭐</div>
          <h3>Избранное</h3>
          <p>Сохраненные новости: {favorites.length}</p>
        </div>
        <div className="menu-card" role="button" tabIndex={0} onClick={() => setActiveSection('settings')}>
          <div className="menu-icon">⚙️</div>
          <h3>Настройки</h3>
          <p>Персонализация</p>
        </div>
      </div>
      <div className="main-features">
        <h3>🎯 Новые возможности</h3>
        <div className="features-list">
          <div className="feature-item"><span className="feature-icon">📅</span><span>Хронология событий</span></div>
          <div className="feature-item"><span className="feature-icon">⏰</span><span>Фильтрация по времени</span></div>
          <div className="feature-item"><span className="feature-icon">🔍</span><span>Умный анализ запросов</span></div>
        </div>
      </div>
    </div>
  )
  return (
    <div className="app">
      {activeSection === 'main' && <MainMenu />}
      {activeSection === 'chat' && (
        <ChatBot
          onBack={() => setActiveSection('main')}
          onAddToFavorites={addToFavorites}
          favorites={favorites}
        />
      )}
      {activeSection === 'categories' && (
        <CategoriesSection
          onBack={() => setActiveSection('main')}
          onCategorySelect={handleCategorySelect}
        />
      )}
      {activeSection === 'category-news' && selectedCategory && (
        <CategoryNews
          category={selectedCategory}
          onBack={() => setActiveSection('categories')}
          onAddToFavorites={addToFavorites}
          favorites={favorites}
        />
      )}
      {activeSection === 'favorites' && (
        <FavoritesSection
          onBack={() => setActiveSection('main')}
          favorites={favorites}
          onRemoveFromFavorites={removeFromFavorites}
        />
      )}
      {activeSection === 'settings' && (
        <SettingsSection onBack={() => setActiveSection('main')} />
      )}
    </div>
  )
}

// Компонент категорий (обновленный с временными фильтрами)
const CategoriesSection = ({ onBack, onCategorySelect }) => {
  const categories = [
    { 
      id: 'technology', 
      name: 'Технологии', 
      icon: '💻', 
      query: 'technology OR tech OR apple OR google',
      color: '#667eea',
      description: 'IT, гаджеты, инновации'
    },
    { 
      id: 'sports', 
      name: 'Спорт', 
      icon: '⚽', 
      query: 'sports OR football OR basketball OR olympics',
      color: '#4CAF50',
      description: 'Спортивные события и достижения'
    },
    { 
      id: 'politics', 
      name: 'Политика', 
      icon: '🏛️', 
      query: 'politics OR government OR election',
      color: '#FF5722',
      description: 'Внутренняя и внешняя политика'
    },
    { 
      id: 'business', 
      name: 'Бизнес', 
      icon: '💼', 
      query: 'business OR economy OR finance OR market',
      color: '#FF9800',
      description: 'Экономика и финансы'
    },
    { 
      id: 'science', 
      name: 'Наука', 
      icon: '🔬', 
      query: 'science OR research OR discovery',
      color: '#9C27B0',
      description: 'Научные открытия и исследования'
    },
    { 
      id: 'health', 
      name: 'Здоровье', 
      icon: '🏥', 
      query: 'health OR medicine OR healthcare',
      color: '#E91E63',
      description: 'Медицина и здоровый образ жизни'
    },
    { 
      id: 'entertainment', 
      name: 'Развлечения', 
      icon: '🎬', 
      query: 'entertainment OR movie OR music OR celebrity',
      color: '#00BCD4',
      description: 'Кино, музыка, знаменитости'
    },
    { 
      id: 'environment', 
      name: 'Экология', 
      icon: '🌱', 
      query: 'environment OR climate OR ecology',
      color: '#4CAF50',
      description: 'Природа и окружающая среда'
    }
  ]

  return (
    <div className="categories-section">
      <div className="section-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
        <h2>📂 Категории новостей</h2>
        <p>Выберите интересующую вас категорию</p>
      </div>

      <div className="time-filter-info">
        <div className="info-card">
          <div className="info-icon">⏰</div>
          <div className="info-content">
            <h4>Фильтрация по времени</h4>
            <p>После выбора категории вы можете настроить фильтры по дате публикации</p>
          </div>
        </div>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => onCategorySelect(category)}
            style={{ '--category-color': category.color }}
          >
            <div className="category-icon" style={{ backgroundColor: category.color }}>
              {category.icon}
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
            <div className="category-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Компонент новостей по категории (обновленный с расширенными фильтрами)
const CategoryNews = ({ category, onBack, onAddToFavorites, favorites }) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [externalLinkArticle, setExternalLinkArticle] = useState(null)
  const [sortBy, setSortBy] = useState('publishedAt')
  const [timeFilter, setTimeFilter] = useState('all')
  const [showTimeline, setShowTimeline] = useState(false)

  const timeFilters = [
    { value: 'all', label: 'Все время' },
    { value: 'today', label: 'Сегодня' },
    { value: 'week', label: 'За неделю' },
    { value: 'month', label: 'За месяц' }
  ]

  const calculateDateRange = (filter) => {
    const now = new Date();
    const from = new Date();
    
    switch (filter) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        return from.toISOString();
      case 'week':
        from.setDate(from.getDate() - 7);
        return from.toISOString();
      case 'month':
        from.setMonth(from.getMonth() - 1);
        return from.toISOString();
      default:
        return null;
    }
  }

  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true)
      setError(null)
      try {
        let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(category.query)}&sortBy=${sortBy}&pageSize=20&apiKey=1621a17b15e54769853284319ee6627b`
        
        if (timeFilter !== 'all') {
          const fromDate = calculateDateRange(timeFilter)
          if (fromDate) {
            apiUrl += `&from=${fromDate.split('T')[0]}`
          }
        }
        
        const response = await fetch(apiUrl)
        const data = await response.json()
        if (data.articles) {
          const filteredArticles = data.articles.filter(article => 
            article.title && article.title !== '[Removed]'
          )
          setArticles(filteredArticles)
        } else {
          setArticles([])
        }
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error)
        setError('Не удалось загрузить новости')
        setArticles([])
      }
      setLoading(false)
    }

    fetchCategoryNews()
  }, [category.query, sortBy, timeFilter])

  const isArticleFavorite = useCallback((article) => {
    return favorites.some(fav => fav.url === article.url)
  }, [favorites])

  const handleExternalLink = useCallback((article) => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }, [])

  const timelineData = showTimeline ? createTimelineFromArticles(articles, category.name) : null

  return (
    <>
      <div className="category-news-section">
        <div className="section-header">
          <button className="back-button" onClick={onBack}>
            ← Назад
          </button>
          <div className="category-header">
            <div 
              className="category-icon-large"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
            <div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
          </div>
        </div>

        <div className="news-controls">
          <div className="control-group">
            <label>Сортировка:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="publishedAt">По дате</option>
              <option value="relevancy">По релевантности</option>
              <option value="popularity">По популярности</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Период:</label>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-select"
            >
              {timeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <button
              className={`timeline-toggle ${showTimeline ? 'active' : ''}`}
              onClick={() => setShowTimeline(!showTimeline)}
            >
              {showTimeline ? '📊 Список' : '📅 Хронология'}
            </button>
          </div>
        </div>

        <div className="news-count">
          Найдено новостей: {articles.length}
          {timeFilter !== 'all' && ` (${timeFilters.find(f => f.value === timeFilter)?.label})`}
        </div>

        {loading ? (
          <div className="loading-news">
            <div className="loading-spinner"></div>
            <p>Загружаем свежие новости...</p>
          </div>
        ) : error ? (
          <div className="error-news">
            <div className="error-icon">⚠️</div>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Попробовать снова
            </button>
          </div>
        ) : showTimeline && timelineData ? (
          <TimelineView
            timeline={timelineData}
            onAddToFavorites={onAddToFavorites}
            favorites={favorites}
            onArticleClick={setExternalLinkArticle}
          />
        ) : articles.length > 0 ? (
          <div className="news-list">
            {articles.map((article, index) => (
              <div key={index} className="news-item">
                <div className="news-item-header">
                  {article.urlToImage && (
                    <img 
                      src={article.urlToImage} 
                      alt={article.title}
                      className="news-item-image"
                    />
                  )}
                  <div className="news-item-badge">
                    #{index + 1}
                  </div>
                </div>
                <div className="news-item-content">
                  <div className="news-time">
                    {new Date(article.publishedAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <h3>{article.title}</h3>
                  <p className="news-excerpt">
                    {article.description || 'Описание отсутствует'}
                  </p>
                  <div className="news-item-meta">
                    <span className="source">{article.source?.name}</span>
                  </div>
                  <div className="news-item-actions">
                    <button 
                      className="read-full-btn"
                      onClick={() => setExternalLinkArticle(article)}
                    >
                      📖 Читать полностью
                    </button>
                    <button 
                      className={`favorite-btn-small ${isArticleFavorite(article) ? 'favorited' : ''}`}
                      onClick={() => onAddToFavorites(article)}
                      title={isArticleFavorite(article) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    >
                      {isArticleFavorite(article) ? '★' : '☆'}
                    </button>
                    <button 
                      className="share-btn-small"
                      onClick={() => {
                        navigator.clipboard.writeText(article.url)
                        alert('Ссылка скопирована в буфер обмена!')
                      }}
                      title="Поделиться ссылкой"
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-news">
            <div className="empty-state">
              <div className="empty-icon">📰</div>
              <h3>Новости не найдены</h3>
              <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
            </div>
          </div>
        )}
      </div>

      {externalLinkArticle && (
        <ExternalLinkModal
          article={externalLinkArticle}
          onClose={() => setExternalLinkArticle(null)}
          onConfirm={() => handleExternalLink(externalLinkArticle)}
        />
      )}
    </>
  )
}

// Компонент избранного (обновленный)
const FavoritesSection = ({ onBack, favorites, onRemoveFromFavorites }) => {
  const [externalLinkArticle, setExternalLinkArticle] = useState(null)
  const [sortBy, setSortBy] = useState('addedAt')
  const [viewMode, setViewMode] = useState('list') // 'list' или 'timeline'

  const handleExternalLink = useCallback((article) => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }, [])

  // Сортировка избранного
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === 'addedAt') {
      return new Date(b.addedAt) - new Date(a.addedAt)
    } else if (sortBy === 'publishedAt') {
      return new Date(b.publishedAt) - new Date(a.publishedAt)
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  const timelineData = viewMode === 'timeline' ? createTimelineFromArticles(sortedFavorites, 'Избранные новости') : null

  return (
    <>
      <div className="favorites-section">
        <div className="section-header">
          <button className="back-button" onClick={onBack}>
            ← Назад
          </button>
          <h2>⭐ Избранные новости</h2>
          <p>Ваши сохраненные новости: {favorites.length}</p>
        </div>

        {favorites.length > 0 && (
          <div className="favorites-controls">
            <div className="control-group">
              <label>Сортировка:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="addedAt">По дате добавления</option>
                <option value="publishedAt">По дате публикации</option>
                <option value="title">По названию</option>
              </select>
            </div>

            <div className="control-group">
              <label>Вид:</label>
              <select 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                className="view-select"
              >
                <option value="list">Список</option>
                <option value="timeline">Хронология</option>
              </select>
            </div>
          </div>
        )}

        {viewMode === 'timeline' && timelineData ? (
          <TimelineView
            timeline={timelineData}
            onAddToFavorites={onRemoveFromFavorites} // Используем как toggle
            favorites={favorites}
            onArticleClick={setExternalLinkArticle}
          />
        ) : sortedFavorites.length > 0 ? (
          <div className="favorites-list">
            {sortedFavorites.map((article, index) => (
              <div key={index} className="favorite-item">
                {article.urlToImage && (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="favorite-item-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div className="favorite-item-content">
                  <div className="favorite-meta">
                    <span className="added-date">
                      Добавлено: {new Date(article.addedAt).toLocaleDateString('ru-RU')}
                    </span>
                    <span className="published-date">
                      Опубликовано: {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description || 'Описание отсутствует'}</p>
                  <div className="favorite-item-meta">
                    <span className="source">{article.source?.name || 'Неизвестный источник'}</span>
                  </div>
                  <div className="favorite-item-actions">
                    <button 
                      className="read-full-btn"
                      onClick={() => setExternalLinkArticle(article)}
                    >
                      📖 Читать на сайте
                    </button>
                    <button 
                      className="remove-favorite-btn"
                      onClick={() => onRemoveFromFavorites(article)}
                    >
                      🗑️ Удалить
                    </button>
                    <button 
                      className="share-btn-small"
                      onClick={() => {
                        navigator.clipboard.writeText(article.url)
                        alert('Ссылка скопирована в буфер обмена!')
                      }}
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-favorites">
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h3>Нет избранных новостей</h3>
              <p>Добавляйте новости в избранное, нажимая на звездочку ☆ в чат-боте или в категориях</p>
              <button 
                className="go-to-chat-btn"
                onClick={onBack}
              >
                💬 Перейти в чат-бот
              </button>
            </div>
          </div>
        )}
      </div>

      {externalLinkArticle && (
        <ExternalLinkModal
          article={externalLinkArticle}
          onClose={() => setExternalLinkArticle(null)}
          onConfirm={() => handleExternalLink(externalLinkArticle)}
        />
      )}
    </>
  )
}

// Компонент настроек (обновленный)
const SettingsSection = ({ onBack }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('infopulse-settings')
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      notifications: true,
      language: 'ru',
      fontSize: 'medium',
      autoClearChat: false,
      vibration: true,
      readerMode: false,
      defaultTimelineView: false,
      timeFormat: 'relative'
    }
  })

  useEffect(() => {
    localStorage.setItem('infopulse-settings', JSON.stringify(settings))
  }, [settings])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearAllData = () => {
    if (window.confirm('Вы уверены? Это удалит все ваши избранные новости и историю чата.')) {
      localStorage.removeItem('infopulse-favorites')
      localStorage.removeItem('infopulse-chat-messages')
      localStorage.removeItem('infopulse-settings')
      alert('Все данные очищены!')
      window.location.reload()
    }
  }

  const exportData = () => {
    const data = {
      favorites: JSON.parse(localStorage.getItem('infopulse-favorites') || '[]'),
      settings: settings,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `infopulse-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="settings-section">
      <div className="section-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
        <h2>⚙️ Настройки</h2>
        <p>Персонализируйте ваше приложение</p>
      </div>

      <div className="settings-content">
        {/* Внешний вид */}
        <div className="settings-group">
          <h3>🎨 Внешний вид</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Тёмная тема</span>
              <span className="setting-description">Включить тёмный режим</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Размер текста</span>
              <span className="setting-description">Настройте размер шрифта</span>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
              className="setting-select"
            >
              <option value="small">Маленький</option>
              <option value="medium">Средний</option>
              <option value="large">Большой</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Режим чтения</span>
              <span className="setting-description">Упрощённый интерфейс для чтения</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.readerMode}
                onChange={(e) => handleSettingChange('readerMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Новостные настройки */}
        <div className="settings-group">
          <h3>📰 Новости</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Хронология по умолчанию</span>
              <span className="setting-description">Показывать временную шкалу автоматически</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.defaultTimelineView}
                onChange={(e) => handleSettingChange('defaultTimelineView', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Формат времени</span>
              <span className="setting-description">Как отображать даты</span>
            </div>
            <select
              value={settings.timeFormat}
              onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
              className="setting-select"
            >
              <option value="relative">Относительный (2 дня назад)</option>
              <option value="absolute">Абсолютный (15.11.2024)</option>
            </select>
          </div>
        </div>

        {/* Уведомления */}
        <div className="settings-group">
          <h3>🔔 Уведомления</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Push-уведомления</span>
              <span className="setting-description">Уведомления о важных новостях</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Вибрация</span>
              <span className="setting-description">Тактильные отклики</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.vibration}
                onChange={(e) => handleSettingChange('vibration', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Чат */}
        <div className="settings-group">
          <h3>💬 Чат</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Автоочистка чата</span>
              <span className="setting-description">Очищать историю при выходе</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoClearChat}
                onChange={(e) => handleSettingChange('autoClearChat', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Управление данными */}
        <div className="settings-group">
          <h3>💾 Данные</h3>
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Экспорт данных</span>
              <span className="setting-description">Скачайте резервную копию</span>
            </div>
            <button className="action-btn export-btn" onClick={exportData}>
              📥 Экспорт
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Очистить все данные</span>
              <span className="setting-description">Удалить избранное и историю</span>
            </div>
            <button className="action-btn clear-btn" onClick={clearAllData}>
              🗑️ Очистить
            </button>
          </div>
        </div>

        {/* Информация о приложении */}
        <div className="settings-group">
          <h3>ℹ️ О приложении</h3>
          <div className="app-info">
            <div className="app-version">
              <strong>Версия:</strong> 2.0.0
            </div>
            <div className="app-build">
              <strong>Сборка:</strong> 2024.11
            </div>
            <div className="app-features">
              <strong>Новые функции:</strong> Хронология событий, Фильтрация по времени, Умный анализ
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
