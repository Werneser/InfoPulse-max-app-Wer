import { BOT_CONFIG } from '../config.js';

const PROXY_BASE = '/api/news'; 

export class NewsService {
    static async searchNews(query, pageSize = 5) {
        try {
            if (!query) return [];
            const url = `${PROXY_BASE}?endpoint=everything&q=${encodeURIComponent(query)}&pageSize=${encodeURIComponent(pageSize)}`;
            const resp = await fetch(url);
            if (!resp.ok) {
                const body = await safeReadResponse(resp);
                console.error('Proxy searchNews error', resp.status, body);
                throw new Error(`Proxy HTTP error ${resp.status}`);
            }
            const data = await resp.json();
            if (data.status && data.status !== 'ok') {
                console.error('NewsAPI returned error', data);
                throw new Error(data.message || 'NewsAPI error');
            }
            return data.articles || [];
        } catch (err) {
            console.error('Ошибка при поиске новостей:', err);
            return [];
        }
    }
    static async getTopHeadlines(category = 'general', pageSize = 5) {
        try {
            const url = `${PROXY_BASE}?endpoint=top-headlines&category=${encodeURIComponent(category)}&pageSize=${encodeURIComponent(pageSize)}`;
            const resp = await fetch(url);
            if (!resp.ok) {
                const body = await safeReadResponse(resp);
                console.error('Proxy getTopHeadlines error', resp.status, body);
                throw new Error(`Proxy HTTP error ${resp.status}`);
            }
            const data = await resp.json();
            if (data.status && data.status !== 'ok') {
                console.error('NewsAPI returned error', data);
                throw new Error(data.message || 'NewsAPI error');
            }
            return data.articles || [];
        } catch (err) {
            console.error('Ошибка при получении топ новостей:', err);
            return [];
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
