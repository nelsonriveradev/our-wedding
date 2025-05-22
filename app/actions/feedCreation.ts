import { db } from "@/lib/firebase"; // importa tu instancia de Firestore admin
import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";

export interface FeedItem {
  userName: string;
  userProfileImage: string;
  userId: string | null;
  caption: string | "";
  fileUrl: string;
  fileType: string;
  createdAt: Date | any;
  // puedes agregar más campos si lo necesitas
}

export async function createFeedItem(data: {
  userName: string;
  userProfileImage: string;
  userId: string;
  caption: string;
  fileUrl: string;
  fileType: string | "";
}): Promise<string | DocumentReference> {
  const feedData: FeedItem = {
    userName: data.userName,
    userProfileImage: data.userProfileImage,
    userId: data.userId,
    caption: data.caption,
    fileUrl: data.fileUrl,
    fileType: data.fileType,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "feed"), feedData);

  return docRef;
}
