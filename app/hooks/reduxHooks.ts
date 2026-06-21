import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

//useSelector rerenderd component als er iets veranderd
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//useDispatch roep je aan met action om een reducer te triggeren
export const useAppDispatch = () => useDispatch<AppDispatch>();
