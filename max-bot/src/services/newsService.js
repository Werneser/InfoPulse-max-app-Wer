import { BOT_CONFIG } from '../config.js';

const NEWS_API_KEY = '1621a17b15e54769853284319ee6627b'; // Ваш API ключ
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class NewsService {
  static async searchNews(query, pageSize = 5) {
    try {
      console.log(`🔍 Поиск новостей по запросу: "${query}"`);
      
      const response = await fetch(
        `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${pageSize}&language=ru&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.message}`);
      }
      
      console.log(`📰 Найдено новостей: ${data.articles?.length || 0}`);
      return data.articles || [];
      
    } catch (error) {
      console.error('❌ Ошибка при поиске новостей:', error);
      throw new Error('Не удалось получить новости. Попробуйте позже.');
    }
  }

  static async getTopHeadlines(category = 'general', pageSize = 5) {
    try {
      console.log(`📊 Получение топ новостей категории: ${category}`);
      
      const response = await fetch(
        `${NEWS_API_BASE_URL}/top-headlines?category=${category}&pageSize=${pageSize}&language=ru&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI error: ${data.message}`);
      }
      
      console.log(`📰 Найдено топ новостей: ${data.articles?.length || 0}`);
      return data.articles || [];
      
    } catch (error) {
      console.error('❌ Ошибка при получении топ новостей:', error);
      throw new Error('Не удалось получить топ новости. Попробуйте позже.');
    }
  }

  static async getTrendingNews() {
    try {
      // Популярные темы для trending
      const trendingQueries = [
        'технологии',
        'спорт',
        'политика',
        'экономика',
        'наука',
        'искусственный интеллект'
      ];
      
      const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
      return await this.searchNews(randomQuery, 3);
      
    } catch (error) {
      console.error('❌ Ошибка при получении trending новостей:', error);
      return [];
    }
  }

  static formatArticle(article, index) {
    const title = article.title || 'Без названия';
    const description = article.description || 'Описание отсутствует';
    const source = article.source?.name || 'Неизвестный источник';
    const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('ru-RU') : 'Дата неизвестна';
    const url = article.url || '#';
    
    // Обрезаем длинный текст
    const shortDescription = description.length > 150 
      ? description.substring(0, 150) + '...' 
      : description;

    return `📰 *${index + 1}. ${title}*

${shortDescription}

*Источник:* ${source}
*Дата:* ${date}
[Читать полностью](${url})`;
  }

  static formatNewsResponse(articles, query) {
    if (!articles || articles.length === 0) {
      return `❌ По запросу "${query}" новостей не найдено.\n\nПопробуйте другой запрос или уточните тему.`;
    }

    const articlesText = articles.map((article, index) => 
      this.formatArticle(article, index)
    ).join('\n\n' + '─'.repeat(30) + '\n\n');

    return `🔍 *Результаты поиска по запросу: "${query}"*\n\n${articlesText}\n\n💡 *Найдено новостей: ${articles.length}*`;
  }
}