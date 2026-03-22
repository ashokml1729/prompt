// Common English words for typing tests
const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only',
  'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use',
  'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new',
  'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'great', 'between', 'need', 'large', 'under', 'never', 'each',
  'right', 'hand', 'high', 'small', 'few', 'place', 'while', 'last',
  'keep', 'same', 'long', 'begin', 'might', 'still', 'found', 'head',
  'own', 'page', 'should', 'country', 'area', 'school', 'world',
  'family', 'young', 'life', 'point', 'state', 'city', 'night',
  'move', 'live', 'find', 'old', 'home', 'door', 'line', 'open',
  'part', 'start', 'story', 'show', 'every', 'much', 'group', 'play',
  'run', 'turn', 'end', 'does', 'help', 'house', 'picture', 'try',
  'ask', 'men', 'change', 'went', 'light', 'kind', 'off', 'name',
  'read', 'land', 'different', 'follow', 'act', 'why', 'call',
  'study', 'water', 'tree', 'farm', 'mother', 'near', 'build',
  'earth', 'father', 'face', 'thing', 'close', 'plant', 'stand',
  'own', 'below', 'hard', 'side', 'away', 'car', 'food', 'number',
  'write', 'add', 'body', 'set', 'always', 'music', 'bring', 'air',
  'eat', 'letter', 'paper', 'mile', 'river', 'often', 'stop', 'fast',
  'cut', 'sure', 'watch', 'color', 'morning', 'table', 'hear', 'grow',
  'talk', 'bird', 'walk', 'top', 'sea', 'draw', 'left', 'late',
  'real', 'fish', 'book', 'pull', 'girl', 'class', 'room', 'list',
  'plan', 'star', 'box', 'field', 'rest', 'space', 'ready', 'full',
  'fact', 'idea', 'red', 'horse', 'warm', 'fly', 'fall', 'map',
  'rain', 'boat', 'fire', 'rock', 'hot', 'ship', 'clear', 'deep',
  'cold', 'power', 'done', 'able', 'common', 'round', 'strong',
  'toward', 'voice', 'sit', 'product', 'black', 'short', 'class',
  'wind', 'question', 'happen', 'complete', 'main', 'enough', 'plain',
  'usual', 'problem', 'contain', 'type', 'speed', 'practice', 'simple',
  'remember', 'measure', 'figure', 'hundred', 'nothing', 'develop',
  'language', 'pattern', 'together', 'travel', 'surface', 'produce',
  'island', 'machine', 'moment', 'early', 'friend', 'possible',
  'system', 'special', 'program', 'company', 'street', 'appear',
  'record', 'support', 'course', 'reason', 'result', 'level',
  'effect', 'center', 'control', 'ground', 'board', 'morning',
  'window', 'several', 'north', 'south', 'order', 'cover', 'piece',
  'answer', 'bottom', 'island', 'human', 'across', 'road', 'mind',
  'voice', 'true', 'whole', 'king', 'direct', 'behind', 'force',
  'brought', 'check', 'game', 'shape', 'decide', 'learn', 'white',
  'thought', 'let', 'green', 'quickly', 'notice', 'finish', 'view',
  'pick', 'carry', 'interest', 'reach', 'rest', 'care', 'hold',
  'five', 'step', 'during', 'note', 'felt', 'test', 'door', 'early',
  'across', 'quite', 'rather', 'among', 'money', 'serve', 'since',
  'against', 'form', 'dark', 'free', 'better', 'best', 'busy',
  'less', 'morning', 'itself', 'along', 'seem', 'both', 'mark',
  'already', 'fall', 'perhaps', 'half', 'ball', 'past', 'small',
  'leave', 'minute', 'unit', 'least', 'until', 'second', 'process',
  'children', 'increase', 'important', 'consider', 'mountain', 'receive',
  'example', 'include', 'believe', 'allow', 'lead', 'stand', 'happen',
  'provide', 'present', 'might', 'continue', 'perhaps', 'within',
  'least', 'power', 'toward', 'together', 'program', 'against'
];

export function generateWords(count = 50) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words.join(' ');
}

export function generateWordsForTime(seconds) {
  // Estimate ~80 WPM max, avg word ~5 chars
  const estimatedWords = Math.ceil((seconds / 60) * 100);
  return generateWords(estimatedWords);
}

export default commonWords;
