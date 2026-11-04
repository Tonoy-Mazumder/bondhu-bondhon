export type IEventItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  image: string;
  organizer: string;
  capacity: number;
  startTime?: string;
  joinedCount: number;
  status: string;
  participants?: string[];
  organizerName?: string;
  organizerImage?: string;
  createdAt: string;
};
