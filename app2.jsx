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
  }
};

// Функция для поиска подходящего ответа
const findBotResponse = (message) => {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const [category, data] of Object.entries(BOT_KNOWLEDGE)) {
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
        return randomResponse;
      }
    }
  }
  
  if (lowerMessage.length < 20 && !lowerMessage.includes('новости') && !lowerMessage.includes('news')) {
    const fallbackResponses = [
      "Интересный вопрос! 🤔 Но я лучше всего умею искать новости. Попробуйте спросить о чём-то актуальном!",
      "Хм... Я специализируюсь на новостях! 📰 Спросите о технологиях, спорте, политике или других темах!",
      "Отличный вопрос! 🎯 Но моя главная сила - поиск свежих новостей. Что вас интересует из последних событий?",
      "Я пока учусь отвечать на такие вопросы! 📚 А пока могу найти для вас актуальные новости по любой теме!"
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
  
  return null;
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
        text: "Привет! Я ваш новостной помощник ИнфоПульс! 🤖\n\nЯ умею:\n🔍 Искать свежие новости\n📂 Показывать новости по категориям\n⭐ Сохранять в избранное\n\nСпросите меня о чём угодно - от технологий до спорта! 🚀",
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
    
    await searchNews(message);
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

  // Демо-новости на случай недоступности API
  const demoNews = [
    {
      title: "Новости о технологиях и инновациях",
      description: "Последние достижения в области искусственного интеллекта и машинного обучения продолжают трансформировать различные отрасли промышленности.",
      url: "https://example.com/tech-news",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "ТехноБлог" }
    },
    {
      title: "Спортивные события недели",
      description: "Важные матчи и турниры в мире футбола, баскетбола и других популярных видов спорта.",
      url: "https://example.com/sports-news",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "СпортЭкспресс" }
    },
    {
      title: "Экономические тенденции",
      description: "Анализ текущей ситуации на финансовых рынках и перспективы развития экономики.",
      url: "https://example.com/economy-news",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "Финансовые Новости" }
    },
    {
      title: "Культурные события",
      description: "Новые выставки, театральные премьеры и музыкальные фестивали, которые стоит посетить.",
      url: "https://example.com/culture-news",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "Культурный Обзор" }
    },
    {
      title: "Научные открытия",
      description: "Исследователи представили новые данные в области медицины и фундаментальной науки.",
      url: "https://example.com/science-news",
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      source: { name: "Научный Вестник" }
    }
  ]

  try {
    console.log('Отправка запроса к NewsAPI...')
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5&apiKey=1621a17b15e54769853284319ee6627b`
    )
    
    console.log('Статус ответа:', response.status)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('Данные от API:', data)
    
    if (data.status === 'error') {
      throw new Error(`API Error: ${data.message || 'Unknown API error'}`)
    }
    
    if (data.articles && data.articles.length > 0) {
      const validArticles = data.articles.filter(article => 
        article.title && article.title !== '[Removed]' && article.url
      )
      
      if (validArticles.length > 0) {
        const newsMessage = {
          id: Date.now() + 1,
          isBot: true,
          timestamp: new Date().toISOString(),
          news: validArticles.slice(0, 5),
          query: query
        }
        setMessages(prev => [...prev, newsMessage])
      } else {
        throw new Error('Все статьи в ответе невалидны или удалены')
      }
    } else {
      // Если нет результатов, используем демо-данные с пояснением
      const newsMessage = {
        id: Date.now() + 1,
        isBot: true,
        timestamp: new Date().toISOString(),
        news: demoNews.map(article => ({
          ...article,
          title: `[ДЕМО] ${article.title} по запросу "${query}"`,
          description: `${article.description} (Это демо-данные, так как API временно недоступно)`
        })),
        query: query,
        isDemo: true
      }
      setMessages(prev => [...prev, newsMessage])
      
      const infoMessage = {
        id: Date.now() + 2,
        text: "⚠️ В настоящее время используется демо-режим. Реальные новости временно недоступны. Мы работаем над восстановлением сервиса.",
        isBot: true,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, infoMessage])
    }
    
  } catch (error) {
    console.error('Критическая ошибка при поиске новостей:', error)
    
    // Используем демо-данные в случае ошибки
    const demoNewsMessage = {
      id: Date.now() + 1,
      isBot: true,
      timestamp: new Date().toISOString(),
      news: demoNews.map(article => ({
        ...article,
        title: `[ДЕМО] ${article.title} по запросу "${query}"`,
        description: `${article.description} (Это демо-данные из-за ошибки: ${error.message})`
      })),
      query: query,
      isDemo: true
    }
    
    const errorMessage = {
      id: Date.now() + 2,
      text: `⚠️ Произошла ошибка при подключении к сервису новостей: ${error.message}. Показываем демо-новости. Попробуйте обновить страницу позже.`,
      isBot: true,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, demoNewsMessage, errorMessage])
  } finally {
    setLoading(false)
  }
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
    processMessage(query)
  }, [processMessage])

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
        text: "Привет! Я ваш новостной помощник ИнфоПульс! 🤖\n\nЯ умею:\n🔍 Искать свежие новости\n📂 Показывать новости по категориям\n⭐ Сохранять в избранное\n\nСпросите меня о чём угодно - от технологий до спорта! 🚀",
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
    "Расскажи о себе",
    "Новости о технологиях",
    "Спортивные события",
    "Политические новости"
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
                {message.news ? (
                  <div className="news-response">
                    <div className="news-intro">
                      📰 Нашел {message.news.length} новостей по запросу "{message.query}":
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
                          <h4>{article.title}</h4>
                          <p>{article.description || 'Описание отсутствует'}</p>
                          <div className="news-meta">
                            <span className="source">{article.source?.name || 'Неизвестный источник'}</span>
                            <span className="time">
                              {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
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
            <p>📰 Быстрый поиск новостей:</p>
            <div className="quick-buttons">
              {['технологии', 'спорт', 'политика', 'экономика', 'наука', 'искусство'].map((query) => (
                <button
                  key={query}
                  onClick={() => handleQuickRequest(query)}
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

// Компонент категорий
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

// Компонент новостей по категории
const CategoryNews = ({ category, onBack, onAddToFavorites, favorites }) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [externalLinkArticle, setExternalLinkArticle] = useState(null)
  const [sortBy, setSortBy] = useState('publishedAt')

  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(category.query)}&sortBy=${sortBy}&pageSize=20&apiKey=1621a17b15e54769853284319ee6627b`
        )
        const data = await response.json()
        if (data.articles) {
          setArticles(data.articles.filter(article => article.title !== '[Removed]'))
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
  }, [category.query, sortBy])

  const isArticleFavorite = useCallback((article) => {
    return favorites.some(fav => fav.url === article.url)
  }, [favorites])

  const handleExternalLink = useCallback((article) => {
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }, [])

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
          <div className="sort-controls">
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
          <div className="news-count">
            Найдено новостей: {articles.length}
          </div>
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
                  <h3>{article.title}</h3>
                  <p className="news-excerpt">
                    {article.description || 'Описание отсутствует'}
                  </p>
                  <div className="news-item-meta">
                    <span className="source">{article.source?.name}</span>
                    <span className="time">
                      {new Date(article.publishedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
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

// Компонент избранного
const FavoritesSection = ({ onBack, favorites, onRemoveFromFavorites }) => {
  const [externalLinkArticle, setExternalLinkArticle] = useState(null)
  const [sortBy, setSortBy] = useState('addedAt')

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
            <div className="sort-controls">
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
          </div>
        )}

        {sortedFavorites.length > 0 ? (
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
                  <h3>{article.title}</h3>
                  <p>{article.description || 'Описание отсутствует'}</p>
                  <div className="favorite-item-meta">
                    <span className="source">{article.source?.name || 'Неизвестный источник'}</span>
                    <span className="time">
                      Добавлено: {new Date(article.addedAt).toLocaleDateString('ru-RU')}
                    </span>
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

// Компонент настроек
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
      readerMode: false
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
              <strong>Версия:</strong> 1.0.0
            </div>
            <div className="app-build">
              <strong>Сборка:</strong> 2024.11
            </div>
            <div className="app-features">
              <strong>Функции:</strong> Умный поиск, Категории, Избранное
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Главный компонент приложения
const App = () => {
  const [activeSection, setActiveSection] = useState('main')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('infopulse-favorites')
    return saved ? JSON.parse(saved) : []
  })

  // Сохраняем избранное в localStorage
  useEffect(() => {
    localStorage.setItem('infopulse-favorites', JSON.stringify(favorites))
  }, [favorites])

  // Добавление в избранное
  const addToFavorites = useCallback((article) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.url === article.url)
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.url !== article.url)
      } else {
        return [...prev, { ...article, addedAt: new Date().toISOString() }]
      }
    })
  }, [])

  // Удаление из избранного
  const removeFromFavorites = useCallback((article) => {
    setFavorites(prev => prev.filter(fav => fav.url !== article.url))
  }, [])

  // Обработчик выбора категории
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category)
    setActiveSection('category-news')
  }, [])

  // Главное меню
  const MainMenu = () => (
    <div className="main-menu">
      <h1>📰 ИнфоПульс</h1>
      <p>Ваш AI-помощник для новостей</p>
      
      <div className="menu-grid">
        <div className="menu-card" onClick={() => setActiveSection('chat')}>
          <div className="menu-icon">💬</div>
          <h3>Умный чат-бот</h3>
          <p>Общайтесь с AI-помощником</p>
        </div>
        
        <div className="menu-card" onClick={() => setActiveSection('categories')}>
          <div className="menu-icon">📂</div>
          <h3>Категории</h3>
          <p>Новости по темам</p>
        </div>
        
        <div className="menu-card" onClick={() => setActiveSection('favorites')}>
          <div className="menu-icon">⭐</div>
          <h3>Избранное</h3>
          <p>Сохраненные новости: {favorites.length}</p>
        </div>
        
        <div className="menu-card" onClick={() => setActiveSection('settings')}>
          <div className="menu-icon">⚙️</div>
          <h3>Настройки</h3>
          <p>Персонализация</p>
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
        <SettingsSection 
          onBack={() => setActiveSection('main')}
        />
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)