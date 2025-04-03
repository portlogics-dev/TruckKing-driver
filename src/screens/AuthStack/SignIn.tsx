import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useSignin } from "@/api";
import TruckkingLogo from "@/assets/truckking-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useI18n } from "@/i18n";
import { useAuthStore, usePermanentStorage } from "@/store";
import { AuthStackScreenProps } from "@/type";

const SignIn = ({ navigation }: AuthStackScreenProps<"SignIn">) => {
  const { t } = useI18n();

  const { setIsSignedIn } = useAuthStore();
  const {
    remember,
    setRemember,
    rememberVehicleNumber,
    setRememberVehicleNumber,
  } = usePermanentStorage();

  const signinFormSchema = z.object({
    vehicleNumber: z
      .string()
      .min(1, { message: t("Vehicle Number required.") }),
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

    try {
      await signinMutation.mutateAsync({
        vehicleNumber: values.vehicleNumber,
        pincode: values.password,
      });
      setIsSignedIn(true);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: t("Sign in failed"),
        text2:
          e instanceof Error
            ? e.message
            : t("Please check your truck number and password again."),
      });
    }
  };

  return (
    <View className="flex flex-1 justify-center gap-16 px-6">
      <View className="flex items-center">
        <TruckkingLogo width={250} height={150} fill="" />
        <Text className="flex justify-center text-3xl font-bold text-primary">
          Truck KING
        </Text>
      </View>
      <View className="flex gap-4">
        <Controller
          control={form.control}
          name="vehicleNumber"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={t("Vehicle Number")}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {form.formState.errors.vehicleNumber && (
          <Text className="text-destructive">
            {form.formState.errors.vehicleNumber.message}
          </Text>
        )}
        <Controller
          control={form.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
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
          <Text className="text-destructive">
            {form.formState.errors.password.message}
          </Text>
        )}

        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text>{t("Sign in")}</Text>
        </Button>
        <View className="flex items-start">
          <Button onPress={() => navigation.navigate("SignUp")} variant="link">
            <Text className="text-link">{t("Sign up")}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
