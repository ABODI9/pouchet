export type UiProduct = {
  id: string;
  name: string;
  image: string | null;
  price: number;
  // اختياري ويسمح بـ null
  rating?: number | null;
  description?: string | null;
};
