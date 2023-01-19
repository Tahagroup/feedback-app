export const toPersian = (num: any) => num.toLocaleString("fa-ir");
///////////////////////////////////////////////////////////
export function sortCopy(arr: any, field: string) {
  return arr.slice(0).sort(byField(field));
}
function byField(sortField: string) {
  let sorterFn: (issue1: Issue, issue2: Issue) => 1 | -1;
  switch (sortField) {
    case "most-votes":
      sorterFn = function (issue1: Issue, issue2: Issue) {
        return issue1.upVoteCount - issue1.downVoteCount <
          issue2.upVoteCount - issue2.downVoteCount
          ? 1
          : -1;
      };
      break;
    case "most-recent":
      sorterFn = function (issue1: Issue, issue2: Issue) {
        return new Date(issue1.date) < new Date(issue2.date) ? 1 : -1;
      };
      break;
    case "most-comments":
      sorterFn = function (issue1: Issue, issue2: Issue) {
        return issue1.commentsCount < issue2.commentsCount ? 1 : -1;
      };
      break;
    default:
      sorterFn = function (issue1: Issue, issue2: Issue) {
        return issue1.upVoteCount - issue1.downVoteCount <
          issue2.upVoteCount - issue2.downVoteCount
          ? 1
          : -1;
      };
  }
  return (issue1: Issue, issue2: Issue) => sorterFn(issue1, issue2);
}
///////////////////////////////////////////////////////////
