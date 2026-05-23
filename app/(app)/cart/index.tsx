import CartFooter from "@/src/components/cart/CartFooter";
import CartHeader from "@/src/components/cart/CartHeader";
import CartItemComponent from "@/src/components/cart/CartItem";
import EmptyCart from "@/src/components/cart/EmptyCart";

import DeleteModal from "@/src/components/DeleteModal";

import { useCartStore } from "@/src/store/cart/cart.store";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Stack } from "expo-router";

import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import Toast from "react-native-toast-message";

export default function CartScreen() {
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const checkout = useCartStore((s) => s.checkout);
  const isCheckingOut = useCartStore((s) => s.isCheckingOut);

  const [showDelete, setShowDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);


  const totalItems = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
  }, [items]);

  const handleCheckout = useCallback(async () => {
    try {
      await checkout(1);

      Toast.show({
        type: "success",
        text1: "Order success",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Order failed",
      });
    }
  }, [checkout]);


  const handleClear = () => {
    setShowDelete(true);
  };

  
  const confirmClear = async () => {
    try {
      setLoadingDelete(true);

      await new Promise((res) => setTimeout(res, 600));

      clearCart();

      Toast.show({
        type: "success",
        text1: "Cart cleared",
      });

      setShowDelete(false);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error clearing cart",
      });
    } finally {
      setLoadingDelete(false);
    }
  };


  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background ,paddingTop:50}}>

 <Stack.Screen options={{ headerShown: false }} />
      <CartHeader
        totalItems={totalItems}
        onClear={handleClear}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.product.id)}
        renderItem={({ item }) => (
          <CartItemComponent
            item={item}
            onDelete={removeItem}
            onUpdateQuantity={updateQuantity}
          />
        )}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />

     
      <CartFooter
        totalItems={totalItems}
        totalPrice={totalPrice}
        loading={isCheckingOut}
        onCheckout={handleCheckout}
      />

   
      <DeleteModal
        visible={showDelete}
        isPending={loadingDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmClear}
      />
    </View>
  );
}