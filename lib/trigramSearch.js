/**
 * Триграммный поиск для нечёткого соответствия
 * Позволяет находить результаты даже при опечатках
 */

/**
 * Генерирует триграммы из строки
 * Например: "поиск" -> ["<по", "пои", "оис", "иск", "ск>"]
 * @param {string} str - Входная строка
 * @returns {Set<string>} - Набор триграмм
 */
export function generateTrigrams(str) {
  if (!str || typeof str !== 'string') return new Set()
  
  // Приводим к нижнему регистру и добавляем границы
  const normalized = `<${str.toLowerCase().trim()}>`
  const trigrams = new Set()
  
  // Генерируем все триграммы (последовательности из 3 символов)
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.substring(i, i + 3))
  }
  
  return trigrams
}

/**
 * Вычисляет коэффициент схожести Жаккара между двумя наборами триграмм
 * Формула: |A ∩ B| / |A ∪ B|
 * @param {Set} set1 - Первый набор триграмм
 * @param {Set} set2 - Второй набор триграмм
 * @returns {number} - Коэффициент от 0 до 1
 */
function jaccardSimilarity(set1, set2) {
  if (set1.size === 0 && set2.size === 0) return 0
  
  // Находим пересечение (intersection)
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  
  // Находим объединение (union)
  const union = new Set([...set1, ...set2])
  
  // Коэффициент Жаккара
  return intersection.size / union.size
}

/**
 * Вычисляет коэффициент схожести Дайса между двумя наборами триграмм
 * Формула: 2 * |A ∩ B| / (|A| + |B|)
 * Более мягкий чем Жаккара, лучше для коротких строк
 * @param {Set} set1 - Первый набор триграмм
 * @param {Set} set2 - Второй набор триграмм
 * @returns {number} - Коэффициент от 0 до 1
 */
function diceSimilarity(set1, set2) {
  if (set1.size === 0 && set2.size === 0) return 0
  if (set1.size === 0 || set2.size === 0) return 0
  
  // Находим пересечение
  const intersection = new Set([...set1].filter(x => set2.has(x)))
  
  // Коэффициент Дайса
  return (2 * intersection.size) / (set1.size + set2.size)
}

/**
 * Вычисляет расстояние Левенштейна (редакционное расстояние)
 * Количество изменений (вставок, удалений, замен) для преобразования одной строки в другую
 * @param {string} str1 - Первая строка
 * @param {string} str2 - Вторая строка
 * @returns {number} - Расстояние
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length
  const len2 = str2.length
  
  // Создаем матрицу расстояний
  const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0))
  
  // Инициализация первой строки и столбца
  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j
  
  // Заполняем матрицу
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // удаление
        matrix[i][j - 1] + 1,     // вставка
        matrix[i - 1][j - 1] + cost // замена
      )
    }
  }
  
  return matrix[len1][len2]
}

/**
 * Комбинированная оценка схожести с учетом различных метрик
 * @param {string} query - Поисковый запрос
 * @param {string} target - Целевая строка для сравнения
 * @returns {Object} - Объект с оценкой и деталями
 */
export function calculateSimilarity(query, target) {
  if (!query || !target) return { score: 0, details: {} }
  
  const queryLower = query.toLowerCase().trim()
  const targetLower = target.toLowerCase().trim()
  
  // 1. Точное совпадение - максимальный приоритет
  if (targetLower === queryLower) {
    return { score: 1.0, details: { type: 'exact', match: true } }
  }
  
  // 2. Начинается с запроса - высокий приоритет
  if (targetLower.startsWith(queryLower)) {
    return { score: 0.95, details: { type: 'startsWith', match: true } }
  }
  
  // 3. Содержит целиком - высокий приоритет
  if (targetLower.includes(queryLower)) {
    // Чем ближе к началу, тем выше оценка
    const position = targetLower.indexOf(queryLower)
    const positionScore = 1 - (position / targetLower.length) * 0.2
    return { 
      score: 0.85 * positionScore, 
      details: { type: 'includes', position } 
    }
  }
  
  // 4. Триграммное сравнение для нечеткого поиска
  const queryTrigrams = generateTrigrams(queryLower)
  const targetTrigrams = generateTrigrams(targetLower)
  
  const jaccardScore = jaccardSimilarity(queryTrigrams, targetTrigrams)
  const diceScore = diceSimilarity(queryTrigrams, targetTrigrams)
  
  // 5. Расстояние Левенштейна (нормализованное)
  const levDistance = levenshteinDistance(queryLower, targetLower)
  const maxLen = Math.max(queryLower.length, targetLower.length)
  const levSimilarity = 1 - (levDistance / maxLen)
  
  // Комбинированная оценка (взвешенное среднее)
  const combinedScore = (
    diceScore * 0.5 +        // Dice coefficient - основная метрика
    jaccardScore * 0.3 +     // Jaccard - дополнительная проверка
    levSimilarity * 0.2      // Levenshtein - для коротких строк
  )
  
  return {
    score: combinedScore,
    details: {
      type: 'fuzzy',
      dice: diceScore,
      jaccard: jaccardScore,
      levenshtein: levSimilarity,
      distance: levDistance
    }
  }
}

/**
 * Выполняет триграммный поиск по массиву элементов
 * @param {string} query - Поисковый запрос
 * @param {Array} items - Массив элементов для поиска
 * @param {Function} getSearchableText - Функция для получения текста из элемента
 * @param {number} threshold - Минимальный порог схожести (0-1)
 * @returns {Array} - Отсортированный массив результатов с оценками
 */
export function trigramSearch(query, items, getSearchableText, threshold = 0.3) {
  if (!query || !query.trim()) return []
  if (!items || items.length === 0) return []
  
  const queryTrimmed = query.trim()
  
  // Если запрос слишком короткий (1-2 символа), используем простой поиск
  if (queryTrimmed.length <= 2) {
    return items.filter(item => {
      const text = getSearchableText(item)
      return text.toLowerCase().includes(queryTrimmed.toLowerCase())
    })
  }
  
  // Выполняем триграммный поиск
  const results = items.map(item => {
    const searchTexts = getSearchableText(item)
    
    // Если вернули массив строк, проверяем каждую
    const textsArray = Array.isArray(searchTexts) ? searchTexts : [searchTexts]
    
    // Находим максимальную схожесть среди всех полей
    let maxSimilarity = { score: 0, details: {} }
    let bestField = null
    
    textsArray.forEach((text, index) => {
      if (text) {
        const similarity = calculateSimilarity(queryTrimmed, text)
        if (similarity.score > maxSimilarity.score) {
          maxSimilarity = similarity
          bestField = index
        }
      }
    })
    
    return {
      item,
      similarity: maxSimilarity,
      field: bestField
    }
  })
  
  // Фильтруем по порогу и сортируем по релевантности
  return results
    .filter(result => result.similarity.score >= threshold)
    .sort((a, b) => b.similarity.score - a.similarity.score)
    .map(result => result.item)
}

/**
 * Подсветка совпадений в тексте
 * @param {string} text - Исходный текст
 * @param {string} query - Поисковый запрос
 * @returns {Array} - Массив сегментов текста с пометками о совпадениях
 */
export function highlightMatches(text, query) {
  if (!text || !query) return [{ text, highlight: false }]
  
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase().trim()
  
  // Точное совпадение
  if (textLower.includes(queryLower)) {
    const index = textLower.indexOf(queryLower)
    return [
      { text: text.substring(0, index), highlight: false },
      { text: text.substring(index, index + query.length), highlight: true },
      { text: text.substring(index + query.length), highlight: false }
    ].filter(segment => segment.text.length > 0)
  }
  
  // Для нечеткого совпадения просто возвращаем весь текст
  return [{ text, highlight: false }]
}

/**
 * Получает подсказки на основе частичного ввода
 * @param {string} query - Частичный запрос
 * @param {Array} items - Массив элементов
 * @param {Function} getSearchableText - Функция для получения текста
 * @param {number} limit - Максимальное количество подсказок
 * @returns {Array} - Массив подсказок
 */
export function getSuggestions(query, items, getSearchableText, limit = 5) {
  if (!query || query.length < 2) return []
  
  const results = trigramSearch(query, items, getSearchableText, 0.4)
  return results.slice(0, limit)
}

