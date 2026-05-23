import { useProduct, useUpdateProduct } from "@/src/hooks/useProducts";
import { useTranslation } from "@/src/i18n/useTranslation";
import { useThemeStore } from "@/src/store/theme.store";
import { darkColors, lightColors } from "@/src/theme/colors";
import { Fonts } from "@/src/theme/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";


import InputNumeric from "@/src/components/ui/NumberInput";
import {
  ProductFormData,
  productSchema,
} from "@/src/validation/product.validation";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const { t } = useTranslation();
  const dark = useThemeStore((s) => s.dark);
  const colors = dark ? darkColors : lightColors;

  const { data: product, isLoading } = useProduct(productId);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const style = styles(colors);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title ?? "",
        price: product.price ?? 0,
        category: product.category ?? "",
        description: product.description ?? "",
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    updateProduct(
      { id: productId, data },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("editProduct.success"),
          });
          router.back();
        },
        onError: () => {
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t("editProduct.error"),
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <View style={style.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const fields: {
    name: keyof ProductFormData;
    label: string;
    multiline?: boolean;
  }[] = [
    { name: "title", label: t("editProduct.fields.titleLabel") },
    { name: "price", label: t("editProduct.fields.price") },
    { name: "category", label: t("editProduct.fields.category") },
    {
      name: "description",
      label: t("editProduct.fields.description"),
      multiline: true,
    },
  ];

  const disabled = isPending;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={style.scroll}>
      <Text style={[style.title, { color: colors.text }]}>
        {t("editProduct.title")}
      </Text>

      {fields.map((field) => (
        <View key={field.name} style={style.field}>
          <Text style={[style.label, { color: colors.text }]}>
            {field.label}
          </Text>

          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value } }) => {
              const errorMsg = errors[field.name]?.message as string | undefined;

              if (field.name === "price") {
                return (
                  <InputNumeric
                    label=""
                    value={Number(value)}
                    onChange={onChange}
                    disabled={disabled}
                    error={errorMsg}
                  />
                );
              }

              return (
                <>
                  <TextInput
                    value={String(value ?? "")}
                    onChangeText={onChange}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 4 : 1}
                    editable={!disabled}
                    style={[
                      style.input,
                      {
                        backgroundColor: colors.surface,
                        borderColor: errorMsg ? colors.error : colors.border,
                        color: colors.text,
                      },
                    ]}
                  />

                  {errorMsg ? (
                    <Text style={{ color: colors.error, fontSize: 12 }}>
                      {errorMsg}
                    </Text>
                  ) : null}
                </>
              );
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={disabled}
        style={[
          style.button,
          {
            backgroundColor: colors.primary,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {isPending ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={style.btnText}>
            {t("editProduct.saveButton")}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLE ================= */

const styles = (colors: typeof lightColors) =>
  StyleSheet.create({
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scroll: {
      padding: 20,
      gap: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: Fonts.brandBold,
    },
    field: {
      gap: 6,
    },
    label: {
      fontSize: 13,
      fontFamily: Fonts.brandBold,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      fontSize: 15,
    },
    button: {
      height: 52,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    btnText: {
      color: colors.background,
      fontFamily: Fonts.brandBold,
      fontSize: 16,
    },
  });