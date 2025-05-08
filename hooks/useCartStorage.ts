import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store/store';
import { getCartFromStorage } from '@/utils/cartStorage';
import { setCartItemsFromStorage } from '@/store/cart/cartSlice';

export const useCartStorage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      getCartFromStorage().then((items) => {
        dispatch(setCartItemsFromStorage(items));
      });
    }
  }, [isAuthenticated , dispatch]);
};
