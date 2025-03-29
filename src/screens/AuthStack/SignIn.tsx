import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useSignin } from "@/api";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/store";
import { AuthStackScreenProps } from "@/type";

const SignIn = ({ navigation }: AuthStackScreenProps<"SignIn">) => {
  const { t } = useI18n();

  const {
    remember,
    setRemember,
    rememberVehicleNumber,
    setRememberVehicleNumber,
    setIsSignedIn,
  } = useAuthStore();

  const signinFormSchema = z.object({
    vehicleNumber: z.string().min(1, { message: t("Truck Number required.") }),
    password: z
      .string()
      .min(1, { message: t("Password required.") })
      .max(4),
    remember: z.boolean(),
  });

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      vehicleNumber: rememberVehicleNumber,
      password: "",
      remember,
    },
  });

  const signinMutation = useSignin();

  const onSubmit: SubmitHandler<z.infer<typeof signinFormSchema>> = async (
    values
  ) => {
    if (values.remember) {
      setRemember(values.remember);
      setRememberVehicleNumber(values.vehicleNumber);
    } else {
      setRemember(false);
      setRememberVehicleNumber("");
    }

    const result = await signinMutation.mutateAsync({
      vehicleNumber: values.vehicleNumber,
      pincode: values.password,
    });

    if (result.ok) {
      setIsSignedIn(true);
    } else {
      Toast.show({
        type: "error",
        text1: t("Sign in failed"),
        text2: t("Please check your truck number and password again."),
      });
    }
  };

  return (
    <View className="flex justify-center items-center gap-4">
      <Text className="flex justify-center text-lg font-bold text-primary">
        Truck KING
      </Text>
      <View className="flex gap-2">
        <Controller
          control={form.control}
          name="vehicleNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("Truck Number")}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {form.formState.errors.vehicleNumber && (
          <Text>{form.formState.errors.vehicleNumber.message}</Text>
        )}
        <Controller
          control={form.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("Password")}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          )}
        />
        {form.formState.errors.password && (
          <Text>{form.formState.errors.password.message}</Text>
        )}
        <Button
          title={t("Sign in")}
          onPress={form.handleSubmit(onSubmit)}
          className="rounded-md"
        />
      </View>
      <View className="flex gap-2">
        {/* <Pressable
          onPress={() =>
            Toast.show({ text1: "Contact", text2: "014-234-1456" })
          }
        >
          <Text>{t("Forgot password")}</Text>
        </Pressable> */}
        <Pressable onPress={() => navigation.navigate("SignUp")}>
          <Text className="text-link">{t("Sign up")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;
