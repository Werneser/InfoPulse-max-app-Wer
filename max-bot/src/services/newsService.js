import { BOT_CONFIG } from '../config.js';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || ''; // ключ берётся из Vite env
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export class NewsService {
    static async searchNews(query, pageSize = 5) {
        try {
            if (!NEWS_API_KEY) {
                console.error('❌ NEWS_API_KEY not set (import.meta.env.VITE_NEWS_API_KEY).');
                return [];
            }

            console.log(`🔍 Поиск новостей по запросу: "${query}"`);

            const url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=${pageSize}&language=ru&apiKey=${NEWS_API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                const body = await safeReadResponse(response);
                console.error('❌ NewsAPI searchNews HTTP error', response.status, body);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'ok') {
                console.error('❌ NewsAPI searchNews API error', data);
                throw new Error(`NewsAPI error: ${data.message || 'unknown'}`);
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
            if (!NEWS_API_KEY) {
                console.error('❌ NEWS_API_KEY not set (import.meta.env.VITE_NEWS_API_KEY).');
                return [];
            }

            console.log(`📊 Получение топ новостей категории: ${category}`);

            const url = `${NEWS_API_BASE_URL}/top-headlines?category=${category}&pageSize=${pageSize}&language=ru&apiKey=${NEWS_API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                const body = await safeReadResponse(response);
                console.error('❌ NewsAPI getTopHeadlines HTTP error', response.status, body);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'ok') {
                console.error('❌ NewsAPI getTopHeadlines API error', data);
                throw new Error(`NewsAPI error: ${data.message || 'unknown'}`);
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

/**
 * Безопасное чтение тела ответа для логирования (если это json или текст).
 */
async function safeReadResponse(response) {
    try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    } catch (e) {
        return null;
    }
}
