"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";

// Custom color palette as Tailwind classes (add these to your tailwind.config.js)
const palette = {
  darkGreen: "text-[#11270b]",
  green: "text-[#71b340]",
  midGreen: "text-[#669d31]",
  olive: "text-[#598b2c]",
  deepOlive: "text-[#3c5a14]",
  pearl: "bg-[#f8f7f3]",
  borderGreen: "border-[#71b340]",
  borderMidGreen: "border-[#669d31]/20",
  bgOlive: "bg-[#598b2c]",
  bgPearl: "bg-[#f8f7f3]",
  bgWhite: "bg-white",
};

const mockPhotos = [
  {
    id: "1",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+1",
    caption: "First dance",
    uploadedBy: "Jessica",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 3,
    liked: false,
  },
  {
    id: "2",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+2",
    caption: "Cutting the cake",
    uploadedBy: "Michael",
    timestamp: "3 hours ago",
    likes: 18,
    comments: 2,
    liked: true,
  },
  {
    id: "3",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+3",
    caption: "Bride's entrance",
    uploadedBy: "Emma",
    timestamp: "4 hours ago",
    likes: 32,
    comments: 5,
    liked: false,
  },
  {
    id: "4",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+4",
    caption: "Family photo",
    uploadedBy: "David",
    timestamp: "5 hours ago",
    likes: 15,
    comments: 1,
    liked: false,
  },
  {
    id: "5",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+5",
    caption: "Venue decoration",
    uploadedBy: "Sophia",
    timestamp: "6 hours ago",
    likes: 27,
    comments: 4,
    liked: false,
  },
  {
    id: "6",
    imageUrl: "/placeholder.svg?height=600&width=600&text=Wedding+Photo+6",
    caption: "Wedding rings",
    uploadedBy: "James",
    timestamp: "7 hours ago",
    likes: 21,
    comments: 2,
    liked: true,
  },
];

export function PhotoGrid() {
  const [photos, setPhotos] = useState(mockPhotos);
  const [feedItems, setFeedItems] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "feed"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedItems(data);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLike = (id: string) => {
    setPhotos(
      photos.map((photo) => {
        if (photo.id === id) {
          return {
            ...photo,
            liked: !photo.liked,
            likes: photo.liked ? photo.likes - 1 : photo.likes + 1,
          };
        }
        return photo;
      })
    );
  };

  return (
    <div
      className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 min-h-screen p-8 ${palette.pearl}`}
    >
      {feedItems.map((photo) => (
        <div
          key={photo.id}
          className={`relative rounded-xl overflow-hidden border-2 ${palette.bgWhite} ${palette.borderGreen} shadow-md transition-shadow`}
        >
          <div
            className={`flex items-center px-3 py-3 border-b ${palette.bgPearl} ${palette.borderMidGreen}`}
          >
            <div
              className={`w-8 h-8 rounded-full  items-center  font-semibold text-base ${palette.bgOlive} text-white overflow-hidden`}
            >
              <Image
                className="mx-auto my-auto rounded-full"
                src={photo.userProfileImage}
                alt={photo.userName}
                height={35}
                width={35}
              />
              {/* {photo.uploadedBy.charAt(0).toUpperCase()} */}
            </div>
            <div className="ml-2">
              <p className={`font-medium text-[0.95rem] ${palette.darkGreen}`}>
                {photo.uploadedBy}
              </p>
              <p className={`text-xs ${palette.midGreen}`}>{photo.timestamp}</p>
            </div>
          </div>

          <div className="relative aspect-square">
            <Image
              src={photo.fileUrl || "/placeholder.svg"}
              alt={photo.caption}
              fill
              className={`object-cover ${palette.bgPearl}`}
            />
          </div>

          <div className="px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 h-auto p-1 ${
                    photo.liked ? palette.green : palette.deepOlive
                  }`}
                  onClick={() => handleLike(photo.id)}
                >
                  <Heart
                    className="w-5 h-5"
                    style={{
                      fill: photo.liked ? "#71b340" : "none",
                      color: photo.liked ? "#71b340" : "#3c5a14",
                    }}
                  />
                  <span className="text-sm">{}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-1 h-auto p-1 ${palette.deepOlive}`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-1 ${palette.olive}`}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
            <p className={`font-medium text-base mt-2 ${palette.darkGreen}`}>
              {photo.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
