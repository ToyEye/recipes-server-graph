export const calculateRating = (votes) => {
  let totalScore = 0;
  let totalVotes = 0;

  for (let score in votes) {
    if (votes.hasOwnProperty(score)) {
      totalScore += parseInt(score[4]) * votes[score];
      totalVotes += votes[score];
    }
  }

  if (totalVotes === 0) {
    return 0;
  }

  const rating = totalScore / totalVotes;

  return rating;
};
