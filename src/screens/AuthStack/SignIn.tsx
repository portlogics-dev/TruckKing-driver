import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useLogin } from "@/api";
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

  const loginFormSchema = z.object({
    vehicleNumber: z.string().min(1, { message: t("Truck Number required.") }),
    password: z.string().min(1, { message: t("Password required.") }),
    remember: z.boolean(),
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      vehicleNumber: rememberVehicleNumber,
      password: "",
      remember,
    },
  });

  const loginMutation = useLogin();

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (
    values
  ) => {
    if (values.remember) {
      setRemember(values.remember);
      setRememberVehicleNumber(values.vehicleNumber);
    } else {
      setRemember(false);
      setRememberVehicleNumber("");
    }

    const result = await loginMutation.mutateAsync({
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
              placeholder="Truck Number"
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
              placeholder="Password"
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
        <Button title="Sign In" onPress={form.handleSubmit(onSubmit)} />
      </View>
      <View className="flex gap-2">
        <Text onPress={() => navigation.navigate("SignUp")}>
          {t("Sign up")}
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
