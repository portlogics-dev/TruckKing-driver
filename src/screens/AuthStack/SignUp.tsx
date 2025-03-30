import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useSignup } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useI18n } from "@/i18n";
import { AuthStackScreenProps } from "@/type";

const SignUp = ({ navigation }: AuthStackScreenProps<"SignUp">) => {
  const { t } = useI18n();

  const signupFormSchema = z
    .object({
      vehicleNumber: z
        .string()
        .min(1, { message: t("Truck Number required.") }),
      password: z
        .string()
        .min(1, { message: t("Password required.") })
        .max(4),
      confirmPW: z.string().min(1).max(4),
    })
    .refine((data) => data.password === data.confirmPW, {
      message: t("Passwords do not match."),
      path: ["confirmPW"],
    });

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      vehicleNumber: "",
      password: "",
      confirmPW: "",
    },
  });

  const signupMutation = useSignup();

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = async (
    values
  ) => {
    const result = await signupMutation.mutateAsync({
      vehicleNumber: values.vehicleNumber,
      pincode: values.password,
    });

    if (result.ok) {
      Toast.show({
        type: "success",
        text1: t("Sign up success"),
        text2: t("Please sign in."),
      });
      navigation.navigate("SignIn");
    } else {
      Toast.show({
        type: "error",
        text1: t("Sign up failed"),
        text2: t("Please check your truck number and password again."),
      });
    }
  };

  return (
    <View className="flex flex-1 justify-center">
      {/* <Image source={"/"} /> */}
      <View className="flex gap-4">
        <Controller
          control={form.control}
          name="vehicleNumber"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                placeholder={t("Truck Number")}
                value={value}
                onChangeText={onChange}
              />
              {form.formState.errors.vehicleNumber && (
                <Text className="text-destructive">
                  {form.formState.errors.vehicleNumber.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                placeholder={t("Password")}
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {form.formState.errors.password && (
                <Text className="text-destructive">
                  {form.formState.errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={form.control}
          name="confirmPW"
          render={({ field: { onChange, value } }) => (
            <View>
              <Input
                placeholder={t("Confirm Password")}
                value={value}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {form.formState.errors.confirmPW && (
                <Text className="text-destructive">
                  {form.formState.errors.confirmPW.message}
                </Text>
              )}
            </View>
          )}
        />

        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text>{t("Sign up")}</Text>
        </Button>
      </View>
    </View>
  );
};

export default SignUp;
