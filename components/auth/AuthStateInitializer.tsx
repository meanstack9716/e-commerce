import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loadAuthState } from "@/store/auth/authSlice";

export function AuthStateInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  return null;
}
