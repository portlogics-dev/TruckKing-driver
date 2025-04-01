import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { Suspense, useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
import ErrorBoundary, {
  FallbackComponentProps,
} from "react-native-error-boundary";

import { useCurrentOrderDetail } from "@/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useI18n } from "@/i18n";
import { CameraIcon, GhostIcon, PhoneIcon, RotateCcwIcon } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";
import { MainStackScreenProps, OrderStatus } from "@/type";

type OrderDetail = {
  id: number;
  company: {
    id: number;
    name: string;
  };
  loading: {
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    expectTime: Dayjs;
  };
  unloading: {
    address: string;
    addressDetail: string;
    latitude: number;
    longitude: number;
    expectTime: Dayjs;
  };
  weight: {
    value: number;
    unit: string;
  };
  price: {
    value: number;
    currency: string;
  };
  status: OrderStatus;
  transitSteps: Array<{
    orderId: number;
    stepEvent: string;
    stepEventName: string;
    stepEventImageUrl: string;
    latitude: number;
    longitude: number;
    createdAt: Dayjs;
  }>;
  tracks: Array<{
    id: number;
    latitude: number;
    longitude: number;
    trackingTime: Dayjs;
  }>;
};

function HomeFallback({ resetError }: FallbackComponentProps) {
  const { t } = useI18n();
  // todo: 인앱 전화 연결
  return (
    <View className="flex flex-1 gap-16">
      <GhostIcon className="size-24 text-muted-foreground" />
      <Text className="text-2xl font-bold">{t("Order not found")}</Text>
      <Button
        onPress={resetError}
        className="flex flex-1 gap-2 text-sm text-muted-foreground text-center"
      >
        <Text>{t("Retry")}</Text>
        <RotateCcwIcon />
      </Button>
      <View className="flex flex-1 gap-2 text-sm text-muted-foreground text-center">
        <PhoneIcon />
        <Button>
          <Text>{t("Contact")}</Text>
        </Button>
      </View>
    </View>
  );
}

function HomeLoading() {
  return (
    <View className="flex flex-1 gap-4">
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
      <Skeleton className="h-12 w-full rounded" />
    </View>
  );
}
export function HomeFetcher(props: MainStackScreenProps<"Home">) {
  // todo: mock data
  // todo 2: data flow structure(tanstack query -> header, body)
  // todo 3: draw ui
  // todo 4: camera feature
  const { data } = useCurrentOrderDetail();

  const fallbackComponent = useCallback(
    (fallbackProps: FallbackComponentProps) => (
      <HomeFallback {...fallbackProps} />
    ),
    []
  );
  return (
    <Suspense fallback={<HomeLoading />}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onError={reset} FallbackComponent={fallbackComponent}>
            <Home {...props} data={data} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}

export function OrderDetailHeader({
  orderId,
  status,
}: {
  orderId: OrderDetail["id"];
  status: OrderDetail["status"];
}) {
  const statusBadgeColor = () => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-lime-500";
      case OrderStatus.CANCELLED:
        return "bg-red-500";
      case OrderStatus.PENDING:
        return "bg-gray-500";
      default:
        return "bg-sky-500";
    }
  };
  return (
    <View className="flex flex-1 justify-stretch bg-transparent">
      <Text className="text-lg font-bold">{orderId ?? "-"}</Text>
      <View className={cn("size-2 rounded-full", statusBadgeColor())} />
    </View>
  );
}

function OrderStep(step: OrderDetail["transitSteps"][number]) {
  return (
    <View className="flex flex-1 rounded justify-between bg-card dark:bg-card-dark ">
      <Text className="font-bold">{step.stepEventName}</Text>
      <Button variant="ghost">
        <CameraIcon />
      </Button>
    </View>
  );
}

function Home({
  navigation,
  data,
}: MainStackScreenProps<"Home"> & { data: OrderDetail }) {
  const { t } = useI18n();
  // header, scrollview, 5 status

  const headerTitle = useCallback(
    () => <OrderDetailHeader orderId={data.id} status={data.status} />,
    [data]
  );
  useEffect(() => {
    navigation.setOptions({
      headerTitle,
    });
  }, [navigation, headerTitle]);

  return (
    <View className="flex flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex flex-1 gap-8">
        <View className="flex flex-1 gap-4">
          {data.transitSteps.map((step) => (
            <OrderStep {...step} />
          ))}
        </View>
        <View className="flex flex-1 gap-4">
          <Text className="text-xl font-bold">{t("Loading")}</Text>
          <View className="rounded bg-card dark:bg-card-dark">
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("Point")}</Text>
              <View>
                <Text>{data.loading.address}</Text>
                <Text className="text-sm text-muted-foreground">
                  {data.loading.addressDetail}
                </Text>
              </View>
            </View>
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("ETA")}</Text>
              <Text>{data.loading.expectTime.format("YYYY-MM-DD HH:mm")}</Text>
            </View>
          </View>
          <Text className="text-xl font-bold">{t("Unloading")}</Text>
          <View className="rounded bg-card dark:bg-card-dark">
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("Point")}</Text>
              <View>
                <Text>{data.unloading.address}</Text>
                <Text className="text-sm text-muted-foreground">
                  {data.unloading.addressDetail}
                </Text>
              </View>
            </View>
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("ETA")}</Text>
              <Text>
                {data.unloading.expectTime.format("YYYY-MM-DD HH:mm")}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-1 gap-4">
          <Text className="text-xl font-bold">{t("Details")}</Text>
          <View className="rounded bg-card dark:bg-card-dark">
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("Weight")}</Text>
              <Text>
                {data.weight.value} {data.weight.unit}
              </Text>
            </View>
            <View className="flex flex-1 justify-between">
              <Text className="font-semibold">{t("Price")}</Text>
              <Text>
                {data.price.value} {data.price.currency}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
