interface Issue {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
  type: string;
  published: boolean;
  reviewed: boolean;
  userId: number;
  commentsCount: number;
  upVoteCount: number;
  downVoteCount: number;
  labels: string[];
}
interface Label {
  color: number;
  id: number;
  name: string;
}

interface SingleIssueResponse {
  date: string;
  description: string;
  id: number;
  published: boolean;
  reviewed: boolean;
  status: string;
  title: string;
  type: string;
  userId: number;
}

interface getUserResponseType {
  id: number;
  name: string;
  verified: boolean;
  email: string;
}
