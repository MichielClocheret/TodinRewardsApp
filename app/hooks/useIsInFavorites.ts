import { useAppSelector } from "./reduxHooks";

export const useIsInFavorites = (shopId: number) => {
  const favorites = useAppSelector((state) => state.favorites);
  return favorites.some((f) => f.id === shopId);
};
