/**
 * Selects a random question based on the option (truth or dare)
 * @param {Array} questions - The array of all questions
 * @param {String} option - Either 'truth' or 'dare'
 * @return {Object} The selected question object
 */
function selectRandomQuestion(questions, option) {
    const filteredQuestions = questions.filter(q => q.type.toLowerCase() === option.toLowerCase());
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  }
  
  module.exports = {
    selectRandomQuestion
  };
