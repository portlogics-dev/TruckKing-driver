import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { useRef } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

import { useSignup } from "@/api/auth";
import { useVehicleTypeList } from "@/api/driver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useI18n } from "@/i18n";
import { useAuthStore } from "@/store";

const SignUp = () => {
  const { t } = useI18n();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);

  const { data: vehicleType } = useVehicleTypeList();

  const signupFormSchema = z.object({
    name: z.string().min(1, { message: t("Name required.") }),
    phoneNumber: z.string().nullable(),
    vehicleNumber: z
      .string()
      .min(1, { message: t("Vehicle Number required.") })
      .refine((value) => /^[A-Z0-9]{4,10}$/.test(value), {
        message: t(
          "Vehicle number must be 4-10 characters long and contain only uppercase letters and numbers"
        ),
      }),
    vehicleType: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .nullable(),
    password: z
      .string()
      // .min(1, { message: t("Password required.") })
      .max(4),
    // confirmPW: z.string().min(1).max(4),
  });
  // .refine((data) => data.password === data.confirmPW, {
  //   message: t("Passwords do not match."),
  //   path: ["confirmPW"],
  // });

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      vehicleNumber: "",
      password: "",
      // confirmPW: "",
    },
  });

  const signupMutation = useSignup();

  const scrollToInput = (inputName: string) => {
    const input = inputRefs.current[inputName];
    if (input) {
      input.measure((_x, _y, _width, _height, _pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: pageY - 100,
          animated: true,
        });
      });
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = async (
    values
  ) => {
    const result = await signupMutation.mutateAsync({
      name: values.name,
      phoneNumber: values.phoneNumber,
      vehicleNumber: values.vehicleNumber,
      vehicleType: values.vehicleType?.value ?? null,
      pincode: values.password,
    });

    if (result.ok) {
      Toast.show({
        type: "success",
        text1: t("Sign up success"),
        text2: t("Please sign in."),
      });
      setIsSignedIn(true);
    } else {
      Toast.show({
        type: "error",
        text1: t("Sign up failed"),
        text2: t("Please check your truck number and password again."),
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="grow px-6"
    >
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow"
      >
        <View className="grow gap-4">
          <View className="grow justify-center">
            <Text className="text-3xl font-bold">{t("Sign up")}</Text>
          </View>
          <View className="grow gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <Text>{t("Name")}</Text>
                      <Text className="text-destructive">*</Text>
                    </View>
                    <Input
                      ref={(ref) => {
                        inputRefs.current.name = ref;
                      }}
                      placeholder={t("Name")}
                      value={value}
                      onChangeText={onChange}
                      onFocus={() => scrollToInput("name")}
                    />
                  </View>
                  {form.formState.errors.name && (
                    <Text className="text-destructive">
                      {form.formState.errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="phoneNumber"
              render={({ field: { onChange, value } }) => (
                <View className="gap-2">
                  <Text>{t("Phone")}</Text>
                  <Input
                    ref={(ref) => {
                      inputRefs.current.phoneNumber = ref;
                    }}
                    placeholder={t("Phone")}
                    value={value ?? undefined}
                    onChangeText={onChange}
                    onFocus={() => scrollToInput("phoneNumber")}
                  />
                  {form.formState.errors.phoneNumber && (
                    <Text className="text-destructive">
                      {form.formState.errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="vehicleNumber"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <Text>{t("Vehicle Number")}</Text>
                      <Text className="text-destructive">*</Text>
                    </View>
                    <Input
                      ref={(ref) => {
                        inputRefs.current.vehicleNumber = ref;
                      }}
                      placeholder={t("Vehicle Number")}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="characters"
                      onFocus={() => scrollToInput("vehicleNumber")}
                    />
                  </View>
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
              name="vehicleType"
              render={({ field }) => (
                <View>
                  <View className="gap-2">
                    <Text>{t("Vehicle Type")}</Text>
                    <View className="border border-input rounded-md">
                      <Picker
                        selectedValue={field.value}
                        onValueChange={field.onChange}
                        enabled={!!vehicleType?.length}
                      >
                        {vehicleType?.map((type) => (
                          <Picker.Item
                            key={type.value}
                            label={type.label}
                            value={type.value}
                          />
                        )) ?? <Picker.Item label={t("No data")} value="" />}
                      </Picker>
                    </View>
                  </View>
                  {form.formState.errors.vehicleType && (
                    <Text className="text-destructive">
                      {form.formState.errors.vehicleType.message}
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
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <Text>{t("Password")}</Text>
                      {/* <Text className="text-destructive">*</Text> */}
                    </View>
                    <Input
                      ref={(ref) => {
                        inputRefs.current.password = ref;
                      }}
                      placeholder={t("Password")}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      onFocus={() => scrollToInput("password")}
                    />
                  </View>
                  {form.formState.errors.password && (
                    <Text className="text-destructive">
                      {form.formState.errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* <Controller
              control={form.control}
              name="confirmPW"
              render={({ field: { onChange, value } }) => (
                <View>
                  <View className="gap-2">
                    <View className="flex-row gap-2">
                      <Text>{t("Confirm Password")}</Text>
                      <Text className="text-destructive">*</Text>
                    </View>
                    <Input
                      ref={(ref) => {
                        inputRefs.current.confirmPW = ref;
                      }}
                      placeholder={t("Confirm Password")}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      onFocus={() => scrollToInput("confirmPW")}
                    />
                  </View>
                  {form.formState.errors.confirmPW && (
                    <Text className="text-destructive">
                      {form.formState.errors.confirmPW.message}
                    </Text>
                  )}
                </View>
              )}
            /> */}
          </View>
          <View className="grow justify-center">
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={
                !form.getValues("name") || !form.getValues("vehicleNumber")
              }
              className="disabled:bg-muted-foreground disabled:text-muted-foreground"
            >
              <Text>{t("Sign up")}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
