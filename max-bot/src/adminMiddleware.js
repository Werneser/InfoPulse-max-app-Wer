import { BOT_CONFIG } from './config.js';

export const adminMiddleware = async (ctx, next) => {
  const userId = ctx.user?.user_id;
  
  console.log('🔍 [ADMIN MIDDLEWARE] Полная информация:', {
    userId: userId,
    updateType: ctx.update?.type,
    messageType: ctx.message?.type,
    hasUser: !!ctx.user,
    hasChat: !!ctx.chat,
    rawUpdate: ctx.update
  });

  // Проверяем разные способы получения user_id
  const possibleUserIds = [
    ctx.user?.user_id,
    ctx.update?.user?.user_id,
    ctx.update?.message?.user?.user_id,
    ctx.update?.callback_query?.user?.user_id
  ].filter(Boolean);

  console.log('📋 Возможные user IDs:', possibleUserIds);

  const effectiveUserId = possibleUserIds[0] || userId;
  const isAdmin = effectiveUserId ? BOT_CONFIG.ADMIN_IDS.includes(effectiveUserId) : false;

  console.log(`👑 Проверка прав: User ${effectiveUserId}, Админ: ${isAdmin}`);
  console.log(`📊 Список админов:`, BOT_CONFIG.ADMIN_IDS);

  ctx.isAdmin = isAdmin;
  ctx.effectiveUserId = effectiveUserId;

  return next();
};