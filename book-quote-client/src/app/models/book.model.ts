export interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  publishedDate: string;
}
