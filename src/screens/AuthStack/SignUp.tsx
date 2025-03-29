import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useSignup } from "@/api";
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
    <View className="flex justify-center items-center gap-4">
      {/* <Image source={"/"} /> */}
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
        <Controller
          control={form.control}
          name="confirmPW"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder={t("Confirm Password")}
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          )}
        />
        {form.formState.errors.confirmPW && (
          <Text>{form.formState.errors.confirmPW.message}</Text>
        )}
        <Button
          title={t("Sign up")}
          onPress={form.handleSubmit(onSubmit)}
          className="rounded-md"
        />
      </View>
    </View>
  );
};

export default SignUp;
