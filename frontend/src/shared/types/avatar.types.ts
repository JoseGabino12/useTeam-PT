export type FunEmojiEyes =
  | "plain"
  | "sad"
  | "tearDrop"
  | "pissed"
  | "cute"
  | "wink"
  | "wink2"
  | "glasses"
  | "closed"
  | "love"
  | "stars"
  | "shades"
  | "closed2"
  | "crying"
  | "sleepClose";

export type FunEmojiMouth =
  | "plain"
  | "sad"
  | "pissed"
  | "cute"
  | "tongueOut"
  | "lilSmile"
  | "shy"
  | "wideSmile"
  | "shout"
  | "smileTeeth"
  | "smileLol"
  | "drip"
  | "kissHeart"
  | "sick"
  | "faceMask";

export type AvatarOption = {
  id: string;
  eyes: FunEmojiEyes;
  mouth: FunEmojiMouth;
  dataUri: string;
};

export type FunEmojiSchema = {
  properties?: {
    eyes?: { items?: { enum?: FunEmojiEyes[] } };
    mouth?: { items?: { enum?: FunEmojiMouth[] } };
  };
};